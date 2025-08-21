import { useState, useCallback, useEffect } from 'react';
import { Play, SkipForward, RotateCcw, StepForward, Info, BookOpen } from 'lucide-react';
import { CodeDisplay } from './components/CodeDisplay';
import { ExecutionLog } from './components/ExecutionLog';
import { DataFlowGraph } from './components/DataFlowGraph';
import { ScenarioSelector } from './components/ScenarioSelector';
import { 
  AppState
} from './types/camel';
import { loadScenarios, executeScenarioFromData, ScenarioData } from './utils/scenarioLoader';

const initialState: AppState = {
  userQuery: '',
  untrustedData: '',
  policies: '',
  mode: 'NORMAL',
  executionSteps: [],
  dataFlowNodes: [],
  dataFlowEdges: [],
  isExecuting: false,
  stepByStep: false,
  currentStep: 0,
  attackDetected: false,
};

function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioData | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioData[]>([]);
  const [pllmCode, setPllmCode] = useState<string>('');
  const [qllmOutput, setQllmOutput] = useState<string>('');

  // Load scenarios from JSON file on mount
  useEffect(() => {
    loadScenarios().then(setScenarios);
  }, []);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const executeSimulation = useCallback(async () => {
    if (!selectedScenario) {
      alert('Please select a scenario first');
      return;
    }

    updateState({ 
      isExecuting: true, 
      executionSteps: [], 
      dataFlowNodes: [],
      dataFlowEdges: [],
      attackDetected: false 
    });

    // Simulate async execution with delays
    setTimeout(() => {
      const result = executeScenarioFromData(selectedScenario);
      
      setPllmCode(result.pllmCode);
      setQllmOutput(result.qllmOutput);
      
      updateState({
        executionSteps: result.steps,
        dataFlowNodes: result.nodes,
        dataFlowEdges: result.edges,
        isExecuting: false,
        currentStep: state.stepByStep ? 0 : result.steps.length - 1,
        attackDetected: result.attackDetected,
        attackDetails: result.attackDetails
      });
    }, 500);
  }, [selectedScenario, state.stepByStep, updateState]);

  const handleStepForward = useCallback(() => {
    if (state.currentStep < state.executionSteps.length - 1) {
      updateState({ currentStep: state.currentStep + 1 });
    }
  }, [state.currentStep, state.executionSteps.length, updateState]);

  const handleReset = useCallback(() => {
    updateState({
      executionSteps: [],
      dataFlowNodes: [],
      dataFlowEdges: [],
      currentStep: 0,
      attackDetected: false
    });
    setPllmCode('');
    setQllmOutput('');
  }, [updateState]);

  const handleScenarioSelect = useCallback((scenario: ScenarioData) => {
    setSelectedScenario(scenario);
    updateState({
      userQuery: scenario.userQuery,
      untrustedData: scenario.untrustedData,
      policies: scenario.policies,
      executionSteps: [],
      dataFlowNodes: [],
      dataFlowEdges: [],
      currentStep: 0,
      attackDetected: false
    });
    setPllmCode('');
    setQllmOutput('');
  }, [updateState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🐪 CaMeL Security Demonstration
              </h1>
              <p className="text-gray-600">
                Interactive demonstration of Google's CaMeL (Capabilities for Machine Learning) 
                approach to defending against prompt injections in LLM agents
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2">
                <a 
                  href="https://arxiv.org/pdf/2503.18813" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-1a1 1 0 100-2h1a4 4 0 014 4v6a4 4 0 01-4 4H6a4 4 0 01-4-4V7a4 4 0 014-4z" clipRule="evenodd"></path>
                  </svg>
                  Read Paper
                </a>
                <a 
                  href="https://github.com/google-research/camel-prompt-injection" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
              <div className="text-xs text-gray-500">
                Made with ❤️ by{' '}
                <a 
                  href="https://adversis.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Adversis.io
                </a>
              </div>
            </div>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <strong>How CaMeL Works:</strong> The system uses two LLMs - a Privileged LLM (P-LLM) 
                that only sees trusted queries and generates code, and a Quarantined LLM (Q-LLM) that 
                processes untrusted data without tool access. Security policies enforce data flow 
                restrictions and capability checks to prevent prompt injection attacks.
              </div>
            </div>
          </div>
        </header>

        <div className="mb-6">
          <ScenarioSelector scenarios={scenarios} onSelectScenario={handleScenarioSelect} />
        </div>

        {selectedScenario && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <BookOpen className="w-5 h-5 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Selected Scenario</h3>
            </div>
            <div className={`p-3 rounded-lg ${
              selectedScenario.isAttack ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
            }`}>
              <h4 className="font-semibold text-gray-800 mb-1">{selectedScenario.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{selectedScenario.description}</p>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-semibold text-gray-700">User Query:</span>
                  <div className="text-xs bg-white p-2 rounded mt-1 font-mono">{selectedScenario.userQuery}</div>
                </div>
                {selectedScenario.untrustedData && (
                  <div>
                    <span className="text-xs font-semibold text-gray-700">Untrusted Data:</span>
                    <div className="text-xs bg-white p-2 rounded mt-1 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {selectedScenario.untrustedData}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-xs font-semibold text-gray-700">Security Policies:</span>
                  <div className="text-xs bg-white p-2 rounded mt-1 font-mono whitespace-pre">{selectedScenario.policies}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Execution Controls</h3>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.stepByStep}
                  onChange={(e) => updateState({ stepByStep: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Step-by-step mode</span>
              </label>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={executeSimulation}
                disabled={state.isExecuting || !selectedScenario}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                {selectedScenario ? 'Execute Scenario' : 'Select a Scenario First'}
              </button>
              
              {state.stepByStep && state.executionSteps.length > 0 && (
                <>
                  <button
                    onClick={handleStepForward}
                    disabled={state.currentStep >= state.executionSteps.length - 1}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                  >
                    <StepForward className="w-4 h-4 mr-2" />
                    Next
                  </button>
                  <button
                    onClick={() => updateState({ currentStep: state.executionSteps.length - 1 })}
                    disabled={state.executionSteps.length === 0}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 transition-colors"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip to End
                  </button>
                </>
              )}
              
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ExecutionLog
            steps={state.stepByStep 
              ? state.executionSteps.slice(0, state.currentStep + 1)
              : state.executionSteps
            }
            currentStep={state.currentStep}
            stepByStep={state.stepByStep}
            totalSteps={state.executionSteps.length}
          />
          
          <CodeDisplay
            pllmCode={pllmCode}
            qllmOutput={qllmOutput}
          />
          
          <DataFlowGraph
            nodes={state.dataFlowNodes}
            edges={state.dataFlowEdges}
            currentStep={state.currentStep}
            isExecuting={state.isExecuting}
          />
        </div>


        <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            Select different scenarios above to see how CaMeL handles both legitimate 
            requests and various attack patterns through its dual-LLM architecture.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;