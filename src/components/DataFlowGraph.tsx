import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DataNode, DataEdge } from '../types/camel';
import { Shield, AlertTriangle, Lock, Database, Server, User, Eye, Ban } from 'lucide-react';

interface DataFlowGraphProps {
  nodes: DataNode[];
  edges: DataEdge[];
  currentStep?: number;
  isExecuting?: boolean;
}

const PLLMNode = ({ data }: { data: any }) => (
  <div className="relative">
    <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-lg shadow-lg min-w-[180px]">
      <div className="flex items-center mb-2">
        <Server className="w-5 h-5 mr-2 text-blue-600" />
        <div className="font-bold text-blue-800">P-LLM</div>
      </div>
      <div className="text-xs text-blue-600 space-y-1">
        <div className="flex items-center">
          <Shield className="w-3 h-3 mr-1" />
          <span>Privileged</span>
        </div>
        <div className="flex items-center">
          <Eye className="w-3 h-3 mr-1" />
          <span>Sees: Trusted Query Only</span>
        </div>
        <div className="font-semibold text-green-600">✓ Has Tool Access</div>
      </div>
      {data.active && (
        <div className="absolute -top-2 -right-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
    <Handle type="source" position={Position.Right} className="w-2 h-2" />
    <Handle type="target" position={Position.Left} className="w-2 h-2" />
  </div>
);

const QLLMNode = ({ data }: { data: any }) => (
  <div className="relative">
    <div className="px-4 py-3 bg-gradient-to-br from-yellow-50 to-orange-100 border-2 border-orange-400 rounded-lg shadow-lg min-w-[180px]">
      <div className="flex items-center mb-2">
        <Lock className="w-5 h-5 mr-2 text-orange-600" />
        <div className="font-bold text-orange-800">Q-LLM</div>
      </div>
      <div className="text-xs text-orange-600 space-y-1">
        <div className="flex items-center">
          <AlertTriangle className="w-3 h-3 mr-1" />
          <span>Quarantined</span>
        </div>
        <div className="flex items-center">
          <Eye className="w-3 h-3 mr-1" />
          <span>Sees: Untrusted Data</span>
        </div>
        <div className="font-semibold text-red-600">✗ NO Tool Access</div>
      </div>
      {data.active && (
        <div className="absolute -top-2 -right-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
    <Handle type="source" position={Position.Right} className="w-2 h-2" />
    <Handle type="target" position={Position.Left} className="w-2 h-2" />
  </div>
);

const PolicyNode = ({ data }: { data: any }) => (
  <div className="relative">
    <div className="px-4 py-3 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 rounded-lg shadow-lg min-w-[160px]">
      <div className="flex items-center mb-2">
        <Shield className="w-5 h-5 mr-2 text-purple-600" />
        <div className="font-bold text-purple-800">Policy Engine</div>
      </div>
      <div className="text-xs text-purple-600">
        <div>Enforces security rules</div>
        <div>Blocks malicious actions</div>
      </div>
      {data.active && (
        <div className="absolute -top-2 -right-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
    <Handle type="source" position={Position.Right} className="w-2 h-2" />
    <Handle type="target" position={Position.Left} className="w-2 h-2" />
  </div>
);

const UserNode = () => (
  <div className="relative">
    <div className="px-4 py-3 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-lg shadow-lg">
      <div className="flex items-center">
        <User className="w-5 h-5 mr-2 text-green-600" />
        <div>
          <div className="font-bold text-green-800">User Query</div>
          <div className="text-xs text-green-600">Trusted Input</div>
        </div>
      </div>
    </div>
    <Handle type="source" position={Position.Right} className="w-2 h-2" />
  </div>
);

const DataSourceNode = ({ data }: { data: any }) => (
  <div className="relative">
    <div className={`px-4 py-3 border-2 rounded-lg shadow-lg ${
      data.malicious 
        ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-400' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-400'
    }`}>
      <div className="flex items-center">
        <Database className={`w-5 h-5 mr-2 ${data.malicious ? 'text-red-600' : 'text-gray-600'}`} />
        <div>
          <div className={`font-bold ${data.malicious ? 'text-red-800' : 'text-gray-800'}`}>
            {data.label || 'Data Source'}
          </div>
          <div className={`text-xs ${data.malicious ? 'text-red-600' : 'text-gray-600'}`}>
            {data.malicious ? '⚠️ Contains Attack' : 'External Data'}
          </div>
        </div>
      </div>
    </div>
    <Handle type="source" position={Position.Right} className="w-2 h-2" />
    <Handle type="target" position={Position.Left} className="w-2 h-2" />
  </div>
);

const OutputNode = ({ data }: { data: any }) => (
  <div className="relative">
    <div className={`px-4 py-3 border-2 rounded-lg shadow-lg ${
      data.blocked 
        ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-400' 
        : 'bg-gradient-to-br from-green-50 to-green-100 border-green-400'
    }`}>
      <div className="flex items-center">
        {data.blocked ? (
          <Ban className="w-5 h-5 mr-2 text-red-600" />
        ) : (
          <Database className="w-5 h-5 mr-2 text-green-600" />
        )}
        <div>
          <div className={`font-bold ${data.blocked ? 'text-red-800' : 'text-green-800'}`}>
            {data.blocked ? 'BLOCKED' : 'Action Executed'}
          </div>
          <div className={`text-xs ${data.blocked ? 'text-red-600' : 'text-green-600'}`}>
            {data.blocked ? 'Attack Prevented' : 'Success'}
          </div>
        </div>
      </div>
    </div>
    <Handle type="target" position={Position.Left} className="w-2 h-2" />
  </div>
);

const nodeTypes = {
  pllm: PLLMNode,
  qllm: QLLMNode,
  policy: PolicyNode,
  user: UserNode,
  datasource: DataSourceNode,
  output: OutputNode,
};

export const DataFlowGraph: React.FC<DataFlowGraphProps> = ({ 
  nodes, 
  edges, 
  currentStep = 0,
  isExecuting = false 
}) => {
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // Create the static CaMeL architecture nodes
    const architectureNodes: Node[] = [
      {
        id: 'user',
        type: 'user',
        position: { x: 50, y: 150 },
        data: { label: 'User Query' }
      },
      {
        id: 'pllm',
        type: 'pllm',
        position: { x: 250, y: 100 },
        data: { 
          label: 'P-LLM',
          active: isExecuting && currentStep >= 0 && currentStep <= 2
        }
      },
      {
        id: 'datasource',
        type: 'datasource',
        position: { x: 250, y: 250 },
        data: { 
          label: nodes.find(n => n.type === 'untrusted') ? 'Untrusted Data' : 'Data Source',
          malicious: nodes.some(n => n.type === 'untrusted')
        }
      },
      {
        id: 'qllm',
        type: 'qllm',
        position: { x: 450, y: 250 },
        data: { 
          label: 'Q-LLM',
          active: isExecuting && currentStep >= 3 && currentStep <= 4
        }
      },
      {
        id: 'policy',
        type: 'policy',
        position: { x: 650, y: 175 },
        data: { 
          label: 'Policy Engine',
          active: isExecuting && currentStep >= 5 && currentStep <= 6
        }
      },
      {
        id: 'output',
        type: 'output',
        position: { x: 850, y: 175 },
        data: { 
          label: 'Output',
          blocked: nodes.some(n => n.id === 'blocked')
        }
      }
    ];

    // Create the edges showing data flow
    const architectureEdges: Edge[] = [
      {
        id: 'e-user-pllm',
        source: 'user',
        target: 'pllm',
        label: 'Trusted Query',
        animated: isExecuting && currentStep === 0,
        style: {
          stroke: '#10b981',
          strokeWidth: 2,
        },
        labelStyle: {
          fontSize: 11,
          fontWeight: 600,
        }
      },
      {
        id: 'e-pllm-data',
        source: 'pllm',
        target: 'datasource',
        label: 'Fetch Data',
        animated: isExecuting && currentStep === 2,
        style: {
          stroke: '#6b7280',
          strokeWidth: 2,
        },
        labelStyle: {
          fontSize: 11,
          fontWeight: 600,
        }
      },
      {
        id: 'e-data-qllm',
        source: 'datasource',
        target: 'qllm',
        label: 'Process in Isolation',
        animated: isExecuting && currentStep === 3,
        style: {
          stroke: nodes.some(n => n.type === 'untrusted') ? '#ef4444' : '#f59e0b',
          strokeWidth: 2,
        },
        labelStyle: {
          fontSize: 11,
          fontWeight: 600,
        }
      },
      {
        id: 'e-qllm-policy',
        source: 'qllm',
        target: 'policy',
        label: 'Processed Data',
        animated: isExecuting && currentStep === 4,
        style: {
          stroke: '#f59e0b',
          strokeWidth: 2,
        },
        labelStyle: {
          fontSize: 11,
          fontWeight: 600,
        }
      },
      {
        id: 'e-pllm-policy',
        source: 'pllm',
        target: 'policy',
        label: 'Action Request',
        type: 'smoothstep',
        animated: isExecuting && currentStep === 5,
        style: {
          stroke: '#3b82f6',
          strokeWidth: 2,
        },
        labelStyle: {
          fontSize: 11,
          fontWeight: 600,
        }
      },
      {
        id: 'e-policy-output',
        source: 'policy',
        target: 'output',
        label: nodes.some(n => n.id === 'blocked') ? 'BLOCKED' : 'Allowed',
        animated: isExecuting && currentStep >= 6,
        style: {
          stroke: nodes.some(n => n.id === 'blocked') ? '#ef4444' : '#10b981',
          strokeWidth: 3,
        },
        labelStyle: {
          fontSize: 11,
          fontWeight: 700,
        }
      }
    ];

    setFlowNodes(architectureNodes);
    setFlowEdges(architectureEdges);
  }, [nodes, edges, currentStep, isExecuting]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setFlowNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setFlowEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Database className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">CaMeL Security Architecture</h3>
        </div>
        <div className="text-xs text-gray-600">
          Key Principle: P-LLM never sees untrusted data • Q-LLM never has tool access
        </div>
      </div>
      
      <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 via-yellow-50 to-purple-50 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="border-r border-gray-300 pr-4">
            <div className="font-semibold text-blue-700 mb-1">🛡️ P-LLM (Privileged)</div>
            <ul className="space-y-1 text-gray-600">
              <li>• Only sees trusted user queries</li>
              <li>• Generates control flow code</li>
              <li>• Has full tool access</li>
            </ul>
          </div>
          <div className="border-r border-gray-300 pr-4">
            <div className="font-semibold text-orange-700 mb-1">🔒 Q-LLM (Quarantined)</div>
            <ul className="space-y-1 text-gray-600">
              <li>• Processes untrusted data</li>
              <li>• Runs in complete isolation</li>
              <li>• NO tool or API access</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-purple-700 mb-1">📋 Policy Engine</div>
            <ul className="space-y-1 text-gray-600">
              <li>• Enforces security rules</li>
              <li>• Validates all actions</li>
              <li>• Blocks malicious attempts</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="h-96 border-2 border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
        >
          <Background color="#e5e7eb" gap={20} />
          <Controls />
        </ReactFlow>
      </div>
      
      <div className="mt-3 bg-gray-50 rounded-lg p-2">
        <div className="text-xs text-gray-600 text-center">
          {isExecuting ? (
            <div className="font-semibold text-blue-600">
              Step {currentStep + 1}: Watch how data flows through the security boundaries
            </div>
          ) : (
            <div>
              This diagram shows how CaMeL prevents prompt injections through architectural isolation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};