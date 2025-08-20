import React from 'react';
import { BookOpen, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface ScenarioSelectorProps {
  scenarios: any[];
  onSelectScenario: (scenario: any) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
  onSelectScenario
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-3">
        <BookOpen className="w-5 h-5 text-indigo-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Example Scenarios</h3>
      </div>
      
      {scenarios.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <Loader className="w-6 h-6 animate-spin mr-2" />
          <span>Loading scenarios...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelectScenario(scenario)}
            className={`p-2 rounded-md border text-left transition-all hover:shadow-md ${
              scenario.isAttack
                ? 'border-red-300 bg-red-50 hover:border-red-400'
                : 'border-green-300 bg-green-50 hover:border-green-400'
            }`}
          >
            <div className="flex items-start">
              <div className="mr-1.5 mt-0.5 flex-shrink-0">
                {scenario.isAttack ? (
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-xs text-gray-800 truncate">
                  {scenario.name}
                </h4>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                  {scenario.description}
                </p>
                <div className="mt-1">
                  <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    scenario.isAttack
                      ? 'bg-red-200 text-red-800'
                      : 'bg-green-200 text-green-800'
                  }`}>
                    {scenario.isAttack ? 'Attack' : 'Benign'}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      )}
    </div>
  );
};