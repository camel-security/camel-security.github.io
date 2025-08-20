import { Scenario, ExecutionStep, DataNode, DataEdge } from '../types/camel';
import { CaMeLValueClass } from './CaMeLValue';

export interface ScenarioData extends Scenario {
  execution: {
    pllmCode: string;
    qllmOutput: string;
    steps: Array<{
      type: string;
      message: string;
      delay: number;
      showCode?: boolean;
      showOutput?: boolean;
      result?: { allowed: boolean; reason: string };
      isBlocked?: boolean;
    }>;
    attackDetected: boolean;
    attackDetails?: string;
  };
}

export interface ScenarioExecution {
  steps: ExecutionStep[];
  nodes: DataNode[];
  edges: DataEdge[];
  pllmCode: string;
  qllmOutput: string;
  attackDetected: boolean;
  attackDetails?: string;
}

let cachedScenarios: ScenarioData[] | null = null;

export async function loadScenarios(): Promise<ScenarioData[]> {
  if (cachedScenarios) {
    return cachedScenarios;
  }

  try {
    const response = await fetch('/scenarios.json');
    const data = await response.json();
    cachedScenarios = data.scenarios;
    return cachedScenarios || [];
  } catch (error) {
    console.error('Failed to load scenarios:', error);
    return [];
  }
}

export function executeScenarioFromData(scenario: ScenarioData): ScenarioExecution {
  const timestamp = Date.now();
  const steps: ExecutionStep[] = [];
  const nodes: DataNode[] = [];
  const edges: DataEdge[] = [];
  
  // Convert scenario steps to ExecutionSteps
  scenario.execution.steps.forEach((step, index) => {
    const executionStep: ExecutionStep = {
      id: `step-${index + 1}`,
      type: step.type as any,
      message: step.message,
      timestamp: timestamp + step.delay,
      isBlocked: step.isBlocked,
      policyResult: step.result,
    };
    
    // Add code if this step should show it
    if (step.showCode && scenario.execution.pllmCode) {
      executionStep.code = scenario.execution.pllmCode;
    }
    
    // Add output if this step should show it
    if (step.showOutput && scenario.execution.qllmOutput) {
      executionStep.output = scenario.execution.qllmOutput;
    }
    
    steps.push(executionStep);
  });
  
  // Create data flow nodes based on scenario type
  if (scenario.isAttack) {
    nodes.push({
      id: 'user-query',
      label: 'User Query (Trusted)',
      value: new CaMeLValueClass(scenario.userQuery, ['p-llm'], ['user', 'trusted']),
      type: 'trusted'
    });
    
    nodes.push({
      id: 'untrusted-data',
      label: 'Untrusted Data',
      value: new CaMeLValueClass(scenario.untrustedData, ['q-llm'], ['external', 'untrusted']),
      type: 'untrusted'
    });
    
    nodes.push({
      id: 'q-llm-output',
      label: 'Q-LLM Output (Threat Detected)',
      value: new CaMeLValueClass(scenario.execution.qllmOutput, ['policy-engine'], ['q-llm', 'quarantined']),
      type: 'quarantined'
    });
    
    nodes.push({
      id: 'blocked',
      label: 'BLOCKED BY POLICY',
      value: new CaMeLValueClass('blocked', ['system'], ['security']),
      type: 'untrusted'
    });
    
    edges.push({ id: 'e1', source: 'user-query', target: 'untrusted-data', label: 'fetch' });
    edges.push({ id: 'e2', source: 'untrusted-data', target: 'q-llm-output', label: 'quarantine', animated: true });
    edges.push({ id: 'e3', source: 'q-llm-output', target: 'blocked', label: 'BLOCKED', animated: true });
  } else {
    nodes.push({
      id: 'user-query',
      label: 'User Query (Trusted)',
      value: new CaMeLValueClass(scenario.userQuery, ['p-llm'], ['user', 'trusted']),
      type: 'trusted'
    });
    
    nodes.push({
      id: 'document',
      label: 'Document',
      value: new CaMeLValueClass('document', ['q-llm'], ['document_store', 'trusted']),
      type: 'trusted'
    });
    
    nodes.push({
      id: 'q-llm-output',
      label: 'Q-LLM Processed Content',
      value: new CaMeLValueClass(scenario.execution.qllmOutput, ['policy-engine'], ['q-llm', 'processed']),
      type: 'quarantined'
    });
    
    nodes.push({
      id: 'output',
      label: 'Successful Output',
      value: new CaMeLValueClass('success', ['system'], ['approved']),
      type: 'output'
    });
    
    edges.push({ id: 'e1', source: 'user-query', target: 'document', label: 'retrieve' });
    edges.push({ id: 'e2', source: 'document', target: 'q-llm-output', label: 'process' });
    edges.push({ id: 'e3', source: 'q-llm-output', target: 'output', label: 'send' });
  }
  
  return {
    steps,
    nodes,
    edges,
    pllmCode: scenario.execution.pllmCode,
    qllmOutput: scenario.execution.qllmOutput,
    attackDetected: scenario.execution.attackDetected,
    attackDetails: scenario.execution.attackDetails
  };
}