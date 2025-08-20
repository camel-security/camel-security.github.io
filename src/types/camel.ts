export interface CaMeLValue {
  value: any;
  readers: string[];
  sources: string[];
  capabilities?: string[];
}

export interface Policy {
  id: string;
  tool: string;
  conditions: string[];
  raw: string;
}

export interface ExecutionStep {
  id: string;
  type: 'p-llm' | 'q-llm' | 'policy-check' | 'execution' | 'error';
  code?: string;
  input?: any;
  output?: any;
  policyResult?: PolicyCheckResult;
  message: string;
  timestamp: number;
  isBlocked?: boolean;
}

export interface PolicyCheckResult {
  allowed: boolean;
  reason: string;
  policy?: Policy;
  violatedCondition?: string;
}

export interface DataNode {
  id: string;
  label: string;
  value: CaMeLValue;
  type: 'trusted' | 'untrusted' | 'quarantined' | 'output';
}

export interface DataEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export type ExecutionMode = 'NORMAL' | 'STRICT';

export interface AppState {
  userQuery: string;
  untrustedData: string;
  policies: string;
  mode: ExecutionMode;
  executionSteps: ExecutionStep[];
  dataFlowNodes: DataNode[];
  dataFlowEdges: DataEdge[];
  isExecuting: boolean;
  stepByStep: boolean;
  currentStep: number;
  attackDetected: boolean;
  attackDetails?: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  userQuery: string;
  untrustedData: string;
  policies: string;
  isAttack: boolean;
}