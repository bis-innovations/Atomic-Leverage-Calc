// Environment Configuration for DeFi Leverage Calculator

export const config = {
  // Aave V3 Configuration
  aave: {
    poolAddressesProvider: import.meta.env.VITE_AAVE_POOL_ADDRESSES_PROVIDER || '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
    poolAddress: import.meta.env.VITE_AAVE_POOL_ADDRESS || '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
    wethGateway: import.meta.env.VITE_AAVE_WETH_GATEWAY || '0xEFFC18fC3b7eb8E676dac549A0c3731EA48F8F47',
  },

  // Graph API Configuration
  graph: {
    apiUrl: import.meta.env.VITE_GRAPH_API_URL || 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3',
    apiKey: import.meta.env.VITE_GRAPH_API_KEY || '',
  },

  // Chain Configuration
  chain: {
    id: parseInt(import.meta.env.VITE_CHAIN_ID || '1'),
    name: import.meta.env.VITE_NETWORK_NAME || 'mainnet',
    rpcUrl: import.meta.env.VITE_RPC_URL || 'https://eth-mainnet.alchemyapi.io/v2/demo',
  },

  // WalletConnect Configuration
  walletConnect: {
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '',
  },

  // 1inch API Configuration
  oneInch: {
    apiUrl: import.meta.env.VITE_1INCH_API_URL || 'https://api.1inch.dev/swap/v6.0',
    apiKey: import.meta.env.VITE_1INCH_API_KEY || '',
  },

  // Etherscan API Configuration
  etherscan: {
    apiKey: import.meta.env.VITE_ETHERSCAN_API_KEY || '',
  },

  // Feature Flags
  features: {
    flashLoans: import.meta.env.VITE_ENABLE_FLASH_LOANS === 'true',
    crossWallet: import.meta.env.VITE_ENABLE_CROSS_WALLET === 'true',
    simulation: import.meta.env.VITE_ENABLE_SIMULATION !== 'false',
  },

  // UI Configuration
  ui: {
    defaultCollateralRatio: parseFloat(import.meta.env.VITE_DEFAULT_COLLATERAL_RATIO || '0.75'),
    defaultHealthFactor: parseFloat(import.meta.env.VITE_DEFAULT_HEALTH_FACTOR || '1.8'),
    maxLoops: parseInt(import.meta.env.VITE_MAX_LOOPS || '10'),
  },

  // Default Assets
  assets: {
    collateral: ['ETH', 'WBTC', 'USDC'],
    borrow: ['USDC', 'USDT', 'DAI'],
  },

  // Risk Parameters
  risk: {
    maxLeverage: 10,
    minHealthFactor: 1.2,
    maxHealthFactor: 3.0,
    liquidationBuffer: 0.1, // 10% buffer
  },
};

// Helper functions
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Network configuration
export const networks = {
  1: {
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/demo',
    explorer: 'https://etherscan.io',
    chainId: 1,
  },
  137: {
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    chainId: 137,
  },
  42161: {
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    chainId: 42161,
  },
};

// Get current network
export const getCurrentNetwork = () => {
  return networks[config.chain.id] || networks[1];
};

// Validate configuration
export const validateConfig = () => {
  const errors: string[] = [];

  if (!config.aave.poolAddress) {
    errors.push('Aave Pool Address is required');
  }

  if (!config.graph.apiUrl) {
    errors.push('Graph API URL is required');
  }

  if (config.chain.id <= 0) {
    errors.push('Valid Chain ID is required');
  }

  return errors;
}; 