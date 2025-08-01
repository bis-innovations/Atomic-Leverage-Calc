// Tests for DeFi Service functionality
import { DeFiService } from '../services/defiService';
import { MarketDataService } from '../services/marketDataService';
import { WalletService } from '../services/walletService';

describe('DeFi Service Tests', () => {
  describe('Safe Loop Simulation', () => {
    test('should simulate 3x safe loop correctly', async () => {
      const strategy = {
        initialDeposit: 100,
        collateralRatio: 0.75,
        maxLoops: 3,
        healthFactorTarget: 1.8,
        flashLoanRescue: true
      };

      const result = await DeFiService.simulateSafeLoop(strategy);

      expect(result).toBeDefined();
      expect(result.collateral).toBeDefined();
      expect(result.debt).toBeDefined();
      expect(result.healthFactor).toBeDefined();
      expect(result.loops).toHaveLength(3);
      expect(parseFloat(result.healthFactor)).toBeGreaterThan(1.8);
    });

    test('should handle different collateral ratios', async () => {
      const strategies = [
        { collateralRatio: 0.5, expectedLoops: 3 },
        { collateralRatio: 0.75, expectedLoops: 3 },
        { collateralRatio: 0.85, expectedLoops: 3 }
      ];

      for (const { collateralRatio, expectedLoops } of strategies) {
        const strategy = {
          initialDeposit: 100,
          collateralRatio,
          maxLoops: 3,
          healthFactorTarget: 1.8,
          flashLoanRescue: true
        };

        const result = await DeFiService.simulateSafeLoop(strategy);
        expect(result.loops).toHaveLength(expectedLoops);
      }
    });

    test('should respect health factor target', async () => {
      const strategy = {
        initialDeposit: 100,
        collateralRatio: 0.75,
        maxLoops: 3,
        healthFactorTarget: 2.0,
        flashLoanRescue: true
      };

      const result = await DeFiService.simulateSafeLoop(strategy);
      expect(parseFloat(result.healthFactor)).toBeGreaterThanOrEqual(2.0);
    });
  });

  describe('Flash Loan Tests', () => {
    test('should execute flash loan successfully', async () => {
      const actions = [
        { asset: 'USDC', amount: '1000', action: 'borrow' as const },
        { asset: 'ETH', amount: '1000', action: 'swap' as const, targetAsset: 'USDC' },
        { asset: 'USDC', amount: '1000', action: 'repay' as const }
      ];

      const result = await DeFiService.executeFlashLoan('1000', 'USDC', actions);
      expect(result).toBe(true);
    });

    test('should handle flash loan failure', async () => {
      // Mock a failed flash loan
      const actions = [
        { asset: 'USDC', amount: '1000000', action: 'borrow' as const } // Excessive amount
      ];

      const result = await DeFiService.executeFlashLoan('1000000', 'USDC', actions);
      expect(result).toBe(false);
    });
  });

  describe('Health Factor Calculations', () => {
    test('should calculate health factor correctly', () => {
      const collateral = 100;
      const debt = 50;
      const collateralRatio = 0.75;

      const healthFactor = DeFiService.calculateHealthFactor(collateral, debt, collateralRatio);
      const expected = (collateral * collateralRatio) / debt;

      expect(healthFactor).toBe(expected);
    });

    test('should identify safe positions', () => {
      const safeHealthFactor = 2.0;
      const unsafeHealthFactor = 1.5;

      expect(DeFiService.isPositionSafe(safeHealthFactor)).toBe(true);
      expect(DeFiService.isPositionSafe(unsafeHealthFactor)).toBe(false);
    });
  });
});

describe('Market Data Service Tests', () => {
  test('should fetch market data', async () => {
    const marketData = await MarketDataService.getMarketData();
    
    expect(marketData).toBeDefined();
    expect(marketData.assets).toBeDefined();
    expect(marketData.assets.ETH).toBeDefined();
    expect(marketData.assets.USDC).toBeDefined();
  });

  test('should get specific asset data', async () => {
    const ethData = await MarketDataService.getAssetData('ETH');
    
    expect(ethData).toBeDefined();
    expect(ethData?.symbol).toBe('ETH');
    expect(ethData?.ltv).toBeGreaterThan(0);
    expect(ethData?.liquidationThreshold).toBeGreaterThan(0);
  });

  test('should calculate health factor with market data', () => {
    const marketData = {
      assets: {
        ETH: {
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
          ltv: 0.75,
          liquidationThreshold: 0.82,
          liquidationBonus: 0.05,
          supplyAPY: 0.02,
          borrowAPY: 0.04,
          price: 2000,
          totalSupply: '1000000',
          totalBorrow: '500000',
          utilizationRate: 0.5
        },
        USDC: {
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          ltv: 0.85,
          liquidationThreshold: 0.89,
          liquidationBonus: 0.05,
          supplyAPY: 0.03,
          borrowAPY: 0.05,
          price: 1,
          totalSupply: '50000000',
          totalBorrow: '30000000',
          utilizationRate: 0.6
        }
      },
      lastUpdated: new Date(),
      chainId: 1
    };

    const collateral = { ETH: 10 };
    const debt = { USDC: 5000 };

    const healthFactor = MarketDataService.calculateHealthFactor(collateral, debt, marketData);
    expect(healthFactor).toBeGreaterThan(0);
  });
});

describe('Wallet Service Tests', () => {
  test('should connect wallet', async () => {
    const wallet = await WalletService.connectWallet();
    
    expect(wallet).toBeDefined();
    expect(wallet?.isConnected).toBe(true);
    expect(wallet?.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  test('should disconnect wallet', async () => {
    const wallet = await WalletService.connectWallet();
    expect(wallet).toBeDefined();

    const result = await WalletService.disconnectWallet(wallet!.address);
    expect(result).toBe(true);

    const connectedWallets = WalletService.getConnectedWallets();
    expect(connectedWallets.find(w => w.address === wallet!.address)?.isConnected).toBe(false);
  });

  test('should send transaction', async () => {
    const transaction = await WalletService.sendTransaction(
      '0x1234567890123456789012345678901234567890',
      '0x0987654321098765432109876543210987654321',
      '1000000000000000000' // 1 ETH
    );

    expect(transaction).toBeDefined();
    expect(transaction.hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(transaction.status).toBe('pending');
  });

  test('should check sufficient balance', () => {
    const wallet = {
      address: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      isConnected: true,
      balance: { ETH: '5.0', USDC: '10000' }
    };

    // Mock wallet in service
    const mockWalletService = {
      ...WalletService,
      getWallet: () => wallet
    };

    expect(mockWalletService.hasSufficientBalance(wallet.address, 'ETH', '3.0')).toBe(true);
    expect(mockWalletService.hasSufficientBalance(wallet.address, 'ETH', '10.0')).toBe(false);
  });

  test('should estimate gas', async () => {
    const gasEstimate = await WalletService.estimateGas(
      '0x1234567890123456789012345678901234567890',
      '0x0987654321098765432109876543210987654321',
      '1000000000000000000'
    );

    expect(parseInt(gasEstimate)).toBeGreaterThan(21000);
  });
});

describe('Integration Tests', () => {
  test('should execute complete DeFi strategy', async () => {
    // 1. Connect wallet
    const wallet = await WalletService.connectWallet();
    expect(wallet).toBeDefined();

    // 2. Get market data
    const marketData = await MarketDataService.getMarketData();
    expect(marketData).toBeDefined();

    // 3. Simulate strategy
    const strategy = {
      initialDeposit: 100,
      collateralRatio: 0.75,
      maxLoops: 3,
      healthFactorTarget: 1.8,
      flashLoanRescue: true
    };

    const result = await DeFiService.simulateSafeLoop(strategy);
    expect(result.healthFactor).toBeDefined();

    // 4. Execute flash loan if needed
    if (parseFloat(result.healthFactor) < 1.8) {
      const flashLoanResult = await DeFiService.executeFlashLoan(
        result.debt,
        'USDC',
        [{ asset: 'USDC', amount: result.debt, action: 'repay' as const }]
      );
      expect(flashLoanResult).toBeDefined();
    }
  });
}); 