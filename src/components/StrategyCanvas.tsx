import { useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import StrategyNode from './StrategyNode';
import SimulationPanel from './SimulationPanel';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { SimulationResult } from '../types';
import { DeFiService } from '../services/defiService';

const nodeTypes = { strategyNode: StrategyNode };

// Initial nodes for 3x Safe Loop example
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'strategyNode',
    position: { x: 250, y: 50 },
    data: { 
      label: 'Deposit ETH', 
      tooltip: 'Supply ETH to Aave as collateral with 75% LTV.',
      type: 'deposit',
      amount: '100',
      asset: 'ETH',
      status: 'success'
    }
  },
  {
    id: '2',
    type: 'strategyNode',
    position: { x: 250, y: 150 },
    data: { 
      label: 'Borrow USDC', 
      tooltip: 'Borrow USDC against ETH collateral (80% of max borrowable).',
      type: 'borrow',
      amount: '60',
      asset: 'USDC',
      status: 'success'
    }
  },
  {
    id: '3',
    type: 'strategyNode',
    position: { x: 250, y: 250 },
    data: { 
      label: 'Swap USDC→ETH', 
      tooltip: 'Swap borrowed USDC for ETH to increase collateral.',
      type: 'swap',
      amount: '60',
      asset: 'USDC→ETH',
      status: 'success'
    }
  },
  {
    id: '4',
    type: 'strategyNode',
    position: { x: 250, y: 350 },
    data: { 
      label: 'Deposit ETH (Loop 2)', 
      tooltip: 'Deposit swapped ETH as additional collateral.',
      type: 'deposit',
      amount: '60',
      asset: 'ETH',
      status: 'success'
    }
  },
  {
    id: '5',
    type: 'strategyNode',
    position: { x: 250, y: 450 },
    data: { 
      label: 'Borrow USDC (Loop 2)', 
      tooltip: 'Borrow additional USDC against increased collateral.',
      type: 'borrow',
      amount: '45',
      asset: 'USDC',
      status: 'success'
    }
  },
  {
    id: '6',
    type: 'strategyNode',
    position: { x: 250, y: 550 },
    data: { 
      label: 'Flash Loan Rescue', 
      tooltip: 'Atomic debt restructuring to optimize position.',
      type: 'flash-loan',
      amount: '105',
      asset: 'USDC',
      status: 'pending'
    }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep' },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep' },
];

export default function StrategyCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleSimulation = async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    
    try {
      // Simulate the 3x Safe Loop using DeFiService
      const strategy = {
        initialDeposit: 100,
        collateralRatio: 0.75,
        maxLoops: 3,
        healthFactorTarget: 1.8,
        flashLoanRescue: true
      };
      
      const result = await DeFiService.simulateSafeLoop(strategy);
      setSimulationResult(result);
      console.log('Simulation Result:', result);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setIsSimulating(false);
    setSimulationResult(null);
  };

  return (
    <div className="flex-1 bg-gray-50 relative">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSimulation}
            disabled={isSimulating}
            className="bg-defi-green text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Strategy Info Panel */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <h3 className="font-semibold text-gray-800 mb-2">3x Safe Loop Strategy</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div>• Initial Deposit: 100 ETH</div>
          <div>• Collateral Ratio: 75% LTV</div>
                      <div>• Health Factor: &gt; 1.8</div>
          <div>• Total Leverage: ~3x</div>
          <div>• Flash Loan Rescue: Enabled</div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background />
        <MiniMap 
          nodeColor="#3B82F6"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Controls />
      </ReactFlow>
      
      {/* Simulation Results Panel */}
      <SimulationPanel 
        result={simulationResult}
        isSimulating={isSimulating}
      />
    </div>
  );
}

 