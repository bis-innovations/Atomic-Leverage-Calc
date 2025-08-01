import { useState } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { SimulationResult, LoopResult } from '../types';

interface SimulationPanelProps {
  result: SimulationResult | null;
  isSimulating: boolean;
}

export default function SimulationPanel({ result, isSimulating }: SimulationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!result && !isSimulating) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-defi-blue" />
          <h3 className="font-semibold text-gray-800">
            {isSimulating ? 'Simulating...' : 'Simulation Results'}
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isSimulating && (
        <div className="flex items-center space-x-2 text-defi-yellow">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span className="text-sm">Running 3x Safe Loop simulation...</span>
        </div>
      )}

      {result && (
        <div className="space-y-3">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-green-600 font-medium">Total Collateral</div>
              <div className="text-lg font-bold">{result.collateral} ETH</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-red-600 font-medium">Total Debt</div>
              <div className="text-lg font-bold">{result.debt} USDC</div>
            </div>
          </div>

          {/* Health Factor */}
          <div className="flex items-center space-x-2">
            {parseFloat(result.healthFactor) >= 1.8 ? (
              <CheckCircle className="w-5 h-5 text-defi-green" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-defi-yellow" />
            )}
            <span className="font-medium">Health Factor: {result.healthFactor}</span>
            {parseFloat(result.healthFactor) >= 1.8 && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Safe</span>
            )}
          </div>

          {/* Flash Loan Status */}
          {result.flashLoanUsed && (
            <div className="flex items-center space-x-2 text-purple-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Flash Loan Rescue: Active</span>
            </div>
          )}

          {/* Detailed Loop Results */}
          {isExpanded && result.loops && (
            <div className="mt-4 border-t pt-3">
              <h4 className="font-medium text-gray-700 mb-2">Loop Details</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {result.loops.map((loop: LoopResult) => (
                  <div key={loop.loop} className="bg-gray-50 p-2 rounded text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Loop {loop.loop}</span>
                      <span className={`px-2 py-1 rounded ${
                        parseFloat(loop.healthFactor) >= 1.8 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        HF: {loop.healthFactor}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-gray-600">
                      <div>Collateral: {loop.collateral} ETH</div>
                      <div>Debt: {loop.debt} USDC</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">Risk Assessment</div>
              <div className="space-y-1 text-xs">
                <div>• Leverage: ~3x (Conservative)</div>
                <div>• Liquidation Buffer: {((parseFloat(result.healthFactor) - 1.0) * 100).toFixed(1)}%</div>
                <div>• Flash Loan Protection: {result.flashLoanUsed ? 'Enabled' : 'Disabled'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 