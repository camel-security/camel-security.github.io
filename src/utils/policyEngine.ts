import { Policy, PolicyCheckResult, CaMeLValue } from '../types/camel';

export function parsePolicies(policiesText: string): Policy[] {
  const policies: Policy[] = [];
  const lines = policiesText.split('\n').filter(line => line.trim());
  
  let currentPolicy: Partial<Policy> | null = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('POLICY') || (!trimmed.startsWith('-') && trimmed.includes(':'))) {
      if (currentPolicy && currentPolicy.tool) {
        policies.push({
          id: `policy-${policies.length}`,
          tool: currentPolicy.tool,
          conditions: currentPolicy.conditions || [],
          raw: currentPolicy.raw || ''
        });
      }
      
      const match = trimmed.match(/(?:POLICY\s+)?(\w+):/);
      if (match) {
        currentPolicy = {
          tool: match[1],
          conditions: [],
          raw: trimmed
        };
      }
    } else if (trimmed.startsWith('-') && currentPolicy) {
      currentPolicy.conditions = currentPolicy.conditions || [];
      currentPolicy.conditions.push(trimmed.substring(1).trim());
      currentPolicy.raw = (currentPolicy.raw || '') + '\n' + trimmed;
    }
  }
  
  if (currentPolicy && currentPolicy.tool) {
    policies.push({
      id: `policy-${policies.length}`,
      tool: currentPolicy.tool,
      conditions: currentPolicy.conditions || [],
      raw: currentPolicy.raw || ''
    });
  }
  
  return policies;
}

export function checkPolicy(
  tool: string,
  args: Record<string, any>,
  dataFlow: Map<string, CaMeLValue>,
  policies: Policy[],
  mode: 'NORMAL' | 'STRICT'
): PolicyCheckResult {
  const relevantPolicies = policies.filter(p => 
    p.tool.toLowerCase() === tool.toLowerCase() ||
    p.tool === '*'
  );
  
  if (relevantPolicies.length === 0) {
    return mode === 'STRICT' 
      ? { allowed: false, reason: `No policy defined for tool: ${tool}` }
      : { allowed: true, reason: 'No policy restrictions' };
  }
  
  for (const policy of relevantPolicies) {
    const result = evaluatePolicy(policy, args, dataFlow, mode);
    if (!result.allowed) {
      return result;
    }
  }
  
  return { allowed: true, reason: 'All policies satisfied' };
}

function evaluatePolicy(
  policy: Policy,
  args: Record<string, any>,
  dataFlow: Map<string, CaMeLValue>,
  mode: 'NORMAL' | 'STRICT'
): PolicyCheckResult {
  for (const condition of policy.conditions) {
    const result = evaluateCondition(condition, args, dataFlow, mode);
    
    if (!result.allowed) {
      return {
        allowed: false,
        reason: result.reason,
        policy,
        violatedCondition: condition
      };
    }
  }
  
  return { allowed: true, reason: 'Policy conditions met', policy };
}

function evaluateCondition(
  condition: string,
  args: Record<string, any>,
  dataFlow: Map<string, CaMeLValue>,
  mode: 'NORMAL' | 'STRICT'
): PolicyCheckResult {
  const lower = condition.toLowerCase();
  
  if ((lower.includes(' in ') || lower.includes(' in[')) && !lower.includes('not in')) {
    const match = condition.match(/(\w+)\s+(?:MUST\s+BE\s+)?IN\s+(.+)/i);
    if (match) {
      const [, field, allowedList] = match;
      const value = args[field];
      const allowed = evaluateList(allowedList);
      
      if (!value) {
        return {
          allowed: false,
          reason: `${field} is not defined`
        };
      }
      
      if (!allowed.includes(value)) {
        return {
          allowed: false,
          reason: `${field} "${value}" not in allowed list: ${allowed.join(', ')}`
        };
      }
    }
  }
  
  if (lower.includes('not') && (lower.includes('contains') || lower.includes('includes'))) {
    const match = condition.match(/(\w+)\s+NOT\s+(?:CONTAINS|INCLUDES)\s+['"]?(\w+)['"]?/i);
    if (match) {
      const [, field, forbidden] = match;
      const value = String(args[field] || '');
      
      if (value.toLowerCase().includes(forbidden.toLowerCase())) {
        return {
          allowed: false,
          reason: `${field} contains forbidden term: ${forbidden}`
        };
      }
    }
  }
  
  if (lower.includes('source') && lower.includes('not in')) {
    // Check if any data in the flow comes from untrusted sources
    for (const [, value] of dataFlow) {
      if (value.sources) {
        const hasUntrusted = value.sources.some((source: string) => {
          const sourceLower = source.toLowerCase();
          return sourceLower.includes('untrusted') || 
                 sourceLower.includes('external') || 
                 sourceLower.includes('malicious');
        });
        
        if (hasUntrusted) {
          return {
            allowed: false,
            reason: `Data from untrusted source detected: ${value.sources.join(', ')}`
          };
        }
      }
    }
  }
  
  if (lower.includes('readers') && lower.includes('includes')) {
    const match = condition.match(/data\.readers\s+INCLUDES\s+(\w+)/i);
    if (match) {
      const [, requiredReader] = match;
      const readerValue = args[requiredReader] || requiredReader;
      
      for (const [, value] of dataFlow) {
        if (value.readers && !value.readers.includes(readerValue)) {
          return {
            allowed: false,
            reason: `Data not readable by ${readerValue}`
          };
        }
      }
    }
  }
  
  if (mode === 'STRICT') {
    for (const [, value] of dataFlow) {
      if (value.sources?.some((s: string) => s.includes('untrusted') || s.includes('malicious'))) {
        return {
          allowed: false,
          reason: 'STRICT mode: Untrusted data detected in flow'
        };
      }
    }
  }
  
  return { allowed: true, reason: 'Condition satisfied' };
}

function evaluateList(listExpression: string): string[] {
  const trimmed = listExpression.trim();
  
  if (trimmed === 'trusted_contacts' || trimmed === 'user.contacts') {
    return ['Bob', 'Alice', 'Charlie', 'David', 'Eve'];
  }
  
  if (trimmed.includes('[') && trimmed.includes(']')) {
    const match = trimmed.match(/\[([^\]]+)\]/);
    if (match) {
      return match[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
    }
  }
  
  if (trimmed.includes(',')) {
    return trimmed.split(',').map(s => s.trim().replace(/['"]/g, ''));
  }
  
  return [trimmed.replace(/['"]/g, '')];
}