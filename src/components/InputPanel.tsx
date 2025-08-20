import React from 'react';
import { AlertCircle, Shield, User, Database } from 'lucide-react';

interface InputPanelProps {
  userQuery: string;
  untrustedData: string;
  onUserQueryChange: (value: string) => void;
  onUntrustedDataChange: (value: string) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  userQuery,
  untrustedData,
  onUserQueryChange,
  onUntrustedDataChange
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center mb-2">
          <User className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Trusted User Query</h3>
          <Shield className="w-4 h-4 text-green-600 ml-2" />
        </div>
        <textarea
          value={userQuery}
          onChange={(e) => onUserQueryChange(e.target.value)}
          className="w-full h-24 p-3 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm"
          placeholder="Enter your legitimate query (e.g., 'Send Bob the meeting notes')"
        />
        <p className="text-xs text-gray-600 mt-1">
          This input is trusted and goes directly to the Privileged LLM (P-LLM)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center mb-2">
          <Database className="w-5 h-5 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Untrusted Data Input</h3>
          <AlertCircle className="w-4 h-4 text-red-600 ml-2" />
        </div>
        <textarea
          value={untrustedData}
          onChange={(e) => onUntrustedDataChange(e.target.value)}
          className="w-full h-32 p-3 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none font-mono text-sm"
          placeholder="Enter potentially malicious data (e.g., email with hidden prompt injections)"
        />
        <p className="text-xs text-gray-600 mt-1">
          This data is untrusted and will be processed by the Quarantined LLM (Q-LLM) with no tool access
        </p>
      </div>
    </div>
  );
};