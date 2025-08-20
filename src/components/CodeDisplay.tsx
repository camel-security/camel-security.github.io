import React from 'react';
import { Code, Brain, Lock } from 'lucide-react';

interface CodeDisplayProps {
  pllmCode: string;
  qllmOutput: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  pllmCode,
  qllmOutput
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center mb-3">
          <Brain className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">P-LLM Generated Code</h3>
          <Lock className="w-4 h-4 text-green-600 ml-2" />
        </div>
        <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
          <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
            {pllmCode || '# Waiting for execution...'}
          </pre>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Privileged LLM has full tool access and generates control flow
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center mb-3">
          <Code className="w-5 h-5 text-yellow-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Q-LLM Data Extraction</h3>
          <Lock className="w-4 h-4 text-yellow-600 ml-2" />
        </div>
        <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
          <pre className="text-yellow-400 font-mono text-sm whitespace-pre-wrap">
            {qllmOutput || '// Waiting for data processing...'}
          </pre>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Quarantined LLM processes untrusted data without any tool access
        </p>
      </div>
    </div>
  );
};