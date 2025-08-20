import React from 'react';
import { Shield, Info } from 'lucide-react';

interface PolicyEditorProps {
  policies: string;
  onPoliciesChange: (value: string) => void;
  mode: 'NORMAL' | 'STRICT';
  onModeChange: (mode: 'NORMAL' | 'STRICT') => void;
}

export const PolicyEditor: React.FC<PolicyEditorProps> = ({
  policies,
  onPoliciesChange,
  mode,
  onModeChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Security Policies</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Mode:</span>
          <button
            onClick={() => onModeChange('NORMAL')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              mode === 'NORMAL'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => onModeChange('STRICT')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              mode === 'STRICT'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Strict
          </button>
        </div>
      </div>
      
      <textarea
        value={policies}
        onChange={(e) => onPoliciesChange(e.target.value)}
        className="w-full h-40 p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
        placeholder="POLICY send_email:
  - recipient IN trusted_contacts
  - data.source NOT IN untrusted_sources"
      />
      
      <div className="mt-3 p-3 bg-blue-50 rounded-md">
        <div className="flex items-start">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-xs text-gray-700">
            <p className="font-semibold mb-1">Policy Syntax:</p>
            <ul className="space-y-1 ml-2">
              <li>• <code className="bg-white px-1 rounded">POLICY tool_name:</code> - Define policy for a tool</li>
              <li>• <code className="bg-white px-1 rounded">- condition</code> - Add conditions (all must pass)</li>
              <li>• <code className="bg-white px-1 rounded">IN [list]</code> - Check if value is in list</li>
              <li>• <code className="bg-white px-1 rounded">NOT CONTAINS term</code> - Ensure no forbidden terms</li>
              <li>• <code className="bg-white px-1 rounded">data.source NOT IN untrusted</code> - Check data provenance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};