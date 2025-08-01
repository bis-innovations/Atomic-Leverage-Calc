import { Handle, Position } from 'reactflow';
import { Activity, ArrowDown, ArrowUp } from 'lucide-react';

interface NodeData {
  label: string;
  tooltip: string;
  type: 'deposit' | 'borrow' | 'swap' | 'flash-loan' | 'loop';
  status?: 'pending' | 'success' | 'error';
  amount?: string;
  asset?: string;
}

interface StrategyNodeProps {
  data: NodeData;
}

export default function StrategyNode({ data }: StrategyNodeProps) {
  const getNodeColor = () => {
    switch (data.type) {
      case 'deposit': return 'border-defi-green bg-green-50';
      case 'borrow': return 'border-defi-blue bg-blue-50';
      case 'swap': return 'border-defi-yellow bg-yellow-50';
      case 'flash-loan': return 'border-purple-500 bg-purple-50';
      case 'loop': return 'border-orange-500 bg-orange-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'success': return 'text-defi-green';
      case 'error': return 'text-defi-red';
      case 'pending': return 'text-defi-yellow animate-pulse-slow';
      default: return 'text-gray-500';
    }
  };

  const getIcon = () => {
    switch (data.type) {
      case 'deposit': return <ArrowDown className="w-4 h-4 text-defi-green" />;
      case 'borrow': return <ArrowUp className="w-4 h-4 text-defi-blue" />;
      case 'swap': return <Activity className="w-4 h-4 text-defi-yellow" />;
      case 'flash-loan': return <Activity className="w-4 h-4 text-purple-500" />;
      case 'loop': return <Activity className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className={`node-card ${getNodeColor()} group relative`}>
      <div className="flex items-center space-x-2 mb-2">
        {getIcon()}
        <div className="font-semibold text-gray-800">{data.label}</div>
        {data.status && (
          <div className={`ml-auto ${getStatusColor()}`}>
            <div className="w-2 h-2 rounded-full bg-current"></div>
          </div>
        )}
      </div>
      
      {data.amount && data.asset && (
        <div className="text-sm text-gray-600 mb-2">
          {data.amount} {data.asset}
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        {data.type.replace('-', ' ').toUpperCase()}
      </div>

      {/* Tooltip */}
      <div className="tooltip -top-16 left-1/2 transform -translate-x-1/2">
        <div className="font-medium mb-1">{data.label}</div>
        <div className="text-xs">{data.tooltip}</div>
        {data.amount && (
          <div className="mt-1 text-xs opacity-75">
            Amount: {data.amount} {data.asset}
          </div>
        )}
      </div>

      {/* React Flow Handles */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-defi-blue border-2 border-white"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-defi-green border-2 border-white"
      />
    </div>
  );
} 