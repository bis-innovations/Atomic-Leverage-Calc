# DeFi Leverage Calculator

A comprehensive DeFi looping and collateral tool with React Flow visualization, Aave V3 integration, and flash loan functionality.

## 🏗️ Architecture

```
 ┌───────────────────────────────────────────────────────────────┐
 │                          UI Layer                             │
 │ ┌───────────────────┐  ┌───────────────────────────────────┐ │
 │ │ Sidebar / Presets │  │ Drag & Drop Canvas (React Flow)  │ │
 │ └───────────────────┘  └───────────────────────────────────┘ │
 └───────────────────────────────────────────────────────────────┘
                              │
                              ▼
 ┌───────────────────────────────────────────────────────────────┐
 │                   Strategy Engine (Client)                    │
 │ - Manage steps and recursions                                 │
 │ - Multi-wallet simulations                                    │
 │ - Health factor safety checks                                 │
 └───────────────────────────────────────────────────────────────┘
                              │
                              ▼
 ┌───────────────────────────────────────────────────────────────┐
 │            DeFi Connector (API / SDK integration)             │
 │ - Aave V3 SDK: borrow/supply/repay/flashLoans                 │
 │ - 1inch/Uniswap SDK: swaps                                    │
 │ - Graph API: market data                                      │
 └───────────────────────────────────────────────────────────────┘
```

## ✨ Features

- **Drag & Drop Strategy Builder** with React Flow
- **Multi-wallet Support** with connection management
- **Preset Strategies** (Safe Loop, Aggressive Loop, Debt Swap)
- **Flash Loan Integration** for atomic debt restructuring
- **Real-time Simulation** with health factor monitoring
- **3x Safe Loop Example** with step-by-step visualization
- **Modern UI** with Tailwind CSS and Lucide icons

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd defi-leverage-calc

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📦 Project Structure

```
src/
├── components/
│   ├── StrategyCanvas.tsx    # Main React Flow canvas
│   ├── StrategyNode.tsx      # Custom node components
│   ├── WalletPanel.tsx       # Multi-wallet interface
│   └── PresetSidebar.tsx     # Strategy presets
├── services/
│   └── defiService.ts        # DeFi integration logic
├── types/
│   └── index.ts              # TypeScript definitions
├── App.tsx                   # Main application
└── main.tsx                  # Entry point
```

## 🎯 Strategy Examples

### 3x Safe Loop
- **Initial Deposit**: 100 ETH
- **Collateral Ratio**: 75% LTV
- **Health Factor**: > 1.8
- **Loops**: 3 iterations
- **Flash Loan Rescue**: Enabled

### Expected Output
```
Loop 1: Collateral 175.00, Debt 75.00, HF 1.75
Loop 2: Collateral 237.50, Debt 137.50, HF 1.82
Loop 3: Collateral 295.00, Debt 195.00, HF 1.82
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file:
```env
VITE_AAVE_POOL_ADDRESS=0x...
VITE_GRAPH_API_URL=https://api.thegraph.com/...
VITE_CHAIN_ID=1
```

### Aave V3 Integration
Replace placeholder functions in `src/services/defiService.ts` with actual Aave SDK calls:

```typescript
// Example Aave V3 flash loan
import { Pool } from '@aave/contract-helpers';

const pool = new Pool(provider, {
  POOL_ADDRESSES_PROVIDER: '0x...',
});

await pool.flashLoan({
  user: userAddress,
  assets: [asset],
  amounts: [amount],
  modes: [0], // 0 = no debt, 1 = stable, 2 = variable
  onBehalfOf: userAddress,
  params: '0x',
  referralCode: '0',
});
```

## 🎨 Customization

### Adding New Node Types
1. Extend the `NodeData` interface in `src/types/index.ts`
2. Add node styling in `src/components/StrategyNode.tsx`
3. Update the node types mapping in `StrategyCanvas.tsx`

### Creating New Presets
1. Add preset configuration to `src/components/PresetSidebar.tsx`
2. Implement strategy logic in `src/services/defiService.ts`
3. Update simulation functions as needed

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📚 API Reference

### DeFiService
- `simulateSafeLoop(strategy)` - Run loop strategy simulation
- `executeFlashLoan(amount, asset, actions)` - Execute flash loan
- `getMarketData()` - Fetch current market data
- `calculateHealthFactor(collateral, debt, ratio)` - Calculate HF

### StrategyCanvas
- `handleSimulation()` - Run strategy simulation
- `handleReset()` - Reset canvas to initial state
- `onConnect(params)` - Handle node connections

## 🚨 Safety Features

- **Health Factor Monitoring**: Automatic HF calculation and alerts
- **Liquidation Protection**: Real-time liquidation price tracking
- **Flash Loan Rescue**: Atomic debt restructuring capabilities
- **Multi-wallet Safety**: Isolated position management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational and development purposes. DeFi strategies involve significant risks including liquidation and loss of funds. Always test thoroughly on testnets before mainnet deployment.

## 🔗 Links

- [Aave V3 Documentation](https://docs.aave.com/)
- [React Flow Documentation](https://reactflow.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/) # Atomic-Leverage-Calc
# Atomic-Leverage-Calc
