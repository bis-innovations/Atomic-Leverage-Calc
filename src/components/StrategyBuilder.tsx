import { useState } from 'react';
import { Plus, Trash2, Save, Play } from 'lucide-react';
import { LoopStrategy } from '../types';

interface StrategyBuilderProps {
  onSave: (strategy: LoopStrategy) => void;
  onExecute: (strategy: LoopStrategy) => void;
}

export default function StrategyBuilder({ onSave, onExecute }: StrategyBuilderProps) {
  const [strategy, setStrategy] = useState<LoopStrategy>({
    initialDeposit: 100,
    collateralRatio: 0.75,
    maxLoops: 3,
    healthFactorTarget: 1.8,
    flashLoanRescue: true,
    assets: {
      collateral: 'ETH',
      borrow: 'USDC'
    }
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (field: keyof LoopStrategy, value: any) => {
    setStrategy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAssetChange = (type: 'collateral' | 'borrow', value: string) => {
    setStrategy(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        [type]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(strategy);
  };

  const handleExecute = () => {
    onExecute(strategy);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Strategy Builder</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Basic Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Deposit
            </label>
            <input
              type="number"
              value={strategy.initialDeposit}
              onChange={(e) => handleInputChange('initialDeposit', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-defi-blue focus:border-transparent"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collateral Ratio (LTV)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={strategy.collateralRatio}
              onChange={(e) => handleInputChange('collateralRatio', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-defi-blue focus:border-transparent"
              placeholder="0.75"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Loops
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={strategy.maxLoops}
              onChange={(e) => handleInputChange('maxLoops', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-defi-blue focus:border-transparent"
              placeholder="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Health Factor Target
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={strategy.healthFactorTarget}
              onChange={(e) => handleInputChange('healthFactorTarget', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-defi-blue focus:border-transparent"
              placeholder="1.8"
            />
          </div>
        </div>

        {/* Asset Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collateral Asset
            </label>
            <select
              value={strategy.assets.collateral}
              onChange={(e) => handleAssetChange('collateral', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-defi-blue focus:border-transparent"
            >
              <option value="ETH">ETH</option>
              <option value="WBTC">WBTC</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Borrow Asset
            </label>
            <select
              value={strategy.assets.borrow}
              onChange={(e) => handleAssetChange('borrow', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-defi-blue focus:border-transparent"
            >
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
              <option value="DAI">DAI</option>
            </select>
          </div>
        </div>

        {/* Flash Loan Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="flashLoanRescue"
            checked={strategy.flashLoanRescue}
            onChange={(e) => handleInputChange('flashLoanRescue', e.target.checked)}
            className="w-4 h-4 text-defi-blue bg-gray-100 border-gray-300 rounded focus:ring-defi-blue focus:ring-2"
          />
          <label htmlFor="flashLoanRescue" className="text-sm font-medium text-gray-700">
            Enable Flash Loan Rescue
          </label>
        </div>

        {/* Advanced Parameters (Expanded) */}
        {isExpanded && (
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium text-gray-800">Advanced Parameters</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slippage Tolerance (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  defaultValue="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-defi-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gas Limit
                </label>
                <input
                  type="number"
                  min="21000"
                  defaultValue="500000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-defi-blue focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strategy Name
              </label>
              <input
                type="text"
                placeholder="My Custom Strategy"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-defi-blue focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-defi-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Save className="w-4 h-4" />
            <span>Save Strategy</span>
          </button>
          <button
            onClick={handleExecute}
            className="flex items-center space-x-2 bg-defi-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Play className="w-4 h-4" />
            <span>Execute Strategy</span>
          </button>
        </div>
      </div>
    </div>
  );
} 