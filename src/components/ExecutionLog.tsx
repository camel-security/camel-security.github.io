import React from 'react';
import { Terminal, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { ExecutionStep } from '../types/camel';

interface ExecutionLogProps {
  steps: ExecutionStep[];
  currentStep: number;
  stepByStep: boolean;
}

export const ExecutionLog: React.FC<ExecutionLogProps> = ({
  steps,
  currentStep,
  stepByStep
}) => {
  const getStepIcon = (step: ExecutionStep) => {
    if (step.isBlocked) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    switch (step.type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'policy-check':
        return step.policyResult?.allowed 
          ? <CheckCircle className="w-4 h-4 text-green-600" />
          : <XCircle className="w-4 h-4 text-red-600" />;
      case 'execution':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStepColor = (step: ExecutionStep) => {
    if (step.isBlocked) return 'border-red-500 bg-red-50';
    switch (step.type) {
      case 'p-llm':
        return 'border-green-500 bg-green-50';
      case 'q-llm':
        return 'border-yellow-500 bg-yellow-50';
      case 'policy-check':
        return step.policyResult?.allowed 
          ? 'border-blue-500 bg-blue-50'
          : 'border-red-500 bg-red-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-3">
        <Terminal className="w-5 h-5 text-gray-700 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Execution Log</h3>
        {stepByStep && (
          <span className="ml-auto text-sm text-blue-600 font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
        )}
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {steps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Terminal className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No execution steps yet</p>
            <p className="text-sm mt-1">Click "Execute" to start</p>
          </div>
        ) : (
          steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-3 rounded-md border-l-4 transition-all ${getStepColor(step)} ${
                stepByStep && index > currentStep ? 'opacity-30' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="mr-2 mt-0.5">{getStepIcon(step)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm capitalize">
                      {step.type.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{step.message}</p>
                  
                  {step.code && (
                    <div className="mt-2 p-2 bg-gray-900 rounded text-xs">
                      <pre className="text-green-400 font-mono overflow-x-auto">
                        {step.code}
                      </pre>
                    </div>
                  )}
                  
                  {step.policyResult && !step.policyResult.allowed && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs">
                      <p className="font-semibold text-red-800">Policy Violation:</p>
                      <p className="text-red-700">{step.policyResult.reason}</p>
                      {step.policyResult.violatedCondition && (
                        <p className="text-red-600 mt-1 font-mono">
                          Condition: {step.policyResult.violatedCondition}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};