import React from 'react';
import { AlertTriangle, Shield, X } from 'lucide-react';

interface AttackAlertProps {
  detected: boolean;
  details?: string;
  onClose: () => void;
}

export const AttackAlert: React.FC<AttackAlertProps> = ({
  detected,
  details,
  onClose
}) => {
  if (!detected) return null;

  return (
    <div className="fixed top-4 right-4 max-w-md z-50 animate-pulse">
      <div className="bg-red-100 border-2 border-red-500 rounded-lg shadow-xl p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-bold text-red-800">
              🚨 Attack Detected!
            </h3>
            <p className="text-sm text-red-700 mt-1">
              {details || 'Malicious prompt injection attempt blocked by CaMeL security policies'}
            </p>
            <div className="mt-3 flex items-center text-xs text-red-600">
              <Shield className="w-4 h-4 mr-1" />
              <span>Security policies successfully prevented the attack</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};