import { useState } from 'react';
import { Zap, Shield, TrendingUp, AlertTriangle } from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  tooltip: string;
  risk: 'low' | 'medium' | 'high';
  icon: React.ReactNode;
  description: string;
}

export default function PresetSidebar() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const presets: Preset[] = [
    {
      id: 'safe-loop',
      name: 'Safe Loop',
      tooltip: 'Low leverage, 3x recursion, HF > 1.8',
      risk: 'low',
      icon: <Shield className="w-5 h-5 text-defi-green" />,
      description: 'Conservative 3x leverage with high health factor safety margin'
    },
    {
      id: 'aggressive-loop',
      name: 'Aggressive Loop',
      tooltip: 'High leverage, 6x recursion, HF > 1.2',
      risk: 'high',
      icon: <Zap className="w-5 h-5 text-defi-yellow" />,
      description: 'High leverage strategy with 6x recursion for maximum yield'
    },
    {
      id: 'debt-swap',
      name: 'Debt Swap',
      tooltip: 'Flash loan swap for better rates',
      risk: 'medium',
      icon: <TrendingUp className="w-5 h-5 text-defi-blue" />,
      description: 'Use flash loans to optimize debt positions and rates'
    },
    {
      id: 'cross-wallet',
      name: 'Cross-Wallet Leverage',
      tooltip: 'Supply from Wallet A, borrow from Wallet B',
      risk: 'medium',
      icon: <AlertTriangle className="w-5 h-5 text-defi-yellow" />,
      description: 'Advanced strategy using multiple wallets for position management'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'border-defi-green bg-green-50';
      case 'medium': return 'border-defi-yellow bg-yellow-50';
      case 'high': return 'border-defi-red bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const handlePresetClick = (presetId: string) => {
    setSelectedPreset(presetId);
    // TODO: Load preset into canvas
    console.log('Loading preset:', presetId);
  };

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Strategy Presets</h2>
        
        <div className="space-y-4">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className={`relative group p-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200 ${getRiskColor(preset.risk)} border-2 transition-all duration-200 ${
                selectedPreset === preset.id ? 'ring-2 ring-defi-blue' : ''
              }`}
              onClick={() => handlePresetClick(preset.id)}
            >
              <div className="flex items-center space-x-3">
                {preset.icon}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{preset.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{preset.description}</p>
                </div>
              </div>
              
              <div className="tooltip left-0 top-12">
                <div className="font-medium mb-1">{preset.name}</div>
                <div>{preset.tooltip}</div>
                <div className="mt-2 text-xs opacity-75">
                  Risk Level: {preset.risk.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm">
              Save Current Strategy
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm">
              Export Strategy
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm">
              Share Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 