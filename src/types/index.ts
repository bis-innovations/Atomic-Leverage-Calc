// Type definitions for DeFi Leverage Calculator

export interface NodeData {
  label: string;
  tooltip: string;
  type: 'deposit' | 'borrow' | 'swap' | 'flash-loan' | 'loop';
  status?: 'pending' | 'success' | 'error';
  amount?: string;
  asset?: string;
}

export interface Wallet {
  id: string;
  address: string;
  balance: string;
  isConnected: boolean;
}

export interface Preset {
  id: string;
  name: string;
  tooltip: string;
  risk: 'low' | 'medium' | 'high';
  icon: React.ReactNode;
  description: string;
  strategy: LoopStrategy;
}

export interface LoopStrategy {
  initialDeposit: number;
  collateralRatio: number;
  maxLoops: number;
  healthFactorTarget: number;
  flashLoanRescue: boolean;
  assets: {
    collateral: string;
    borrow: string;
  };
}

export interface MarketData {
  [asset: string]: {
    ltv: number;
    liquidationThreshold: number;
    liquidationBonus: number;
    supplyAPY: number;
    borrowAPY: number;
    price: number;
  };
}

export interface Position {
  collateral: number;
  debt: number;
  healthFactor: number;
  liquidationPrice: number;
  utilizationRate: number;
}

export interface FlashLoanParams {
  asset: string;
  amount: string;
  actions: FlashLoanAction[];
}

export interface FlashLoanAction {
  asset: string;
  amount: string;
  action: 'repay' | 'borrow' | 'swap';
  targetAsset?: string;
}

export interface SimulationResult {
  collateral: string;
  debt: string;
  healthFactor: string;
  loops: LoopResult[];
  flashLoanUsed: boolean;
  totalAPY: number;
  liquidationPrice: number;
}

export interface LoopResult {
  loop: number;
  collateral: string;
  debt: string;
  healthFactor: string;
  borrowable: string;
  borrowed: string;
}

export interface StrategyConfig {
  name: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  maxLoops: number;
  healthFactorTarget: number;
  flashLoanRescue: boolean;
  assets: {
    collateral: string[];
    borrow: string[];
  };
} 