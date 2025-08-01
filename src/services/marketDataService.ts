// Market Data Service for real-time DeFi market information
// This integrates with Aave Graph API and other DeFi data sources

export interface MarketAsset {
  symbol: string;
  name: string;
  decimals: number;
  ltv: number;
  liquidationThreshold: number;
  liquidationBonus: number;
  supplyAPY: number;
  borrowAPY: number;
  price: number;
  totalSupply: string;
  totalBorrow: string;
  utilizationRate: number;
}

export interface MarketData {
  assets: { [symbol: string]: MarketAsset };
  lastUpdated: Date;
  chainId: number;
}

export class MarketDataService {
  private static cache: Map<string, MarketData> = new Map();
  private static cacheTimeout = 30000; // 30 seconds

  // Fetch market data from Aave Graph API
  static async getMarketData(chainId: number = 1): Promise<MarketData> {
    const cacheKey = `market_${chainId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.lastUpdated.getTime() < this.cacheTimeout) {
      return cached;
    }

    try {
      // Simulate API call to Aave Graph
      const marketData = await this.fetchFromAaveGraph(chainId);
      this.cache.set(cacheKey, marketData);
      return marketData;
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      return this.getFallbackMarketData(chainId);
    }
  }

  // Get specific asset data
  static async getAssetData(symbol: string, chainId: number = 1): Promise<MarketAsset | null> {
    const marketData = await this.getMarketData(chainId);
    return marketData.assets[symbol] || null;
  }

  // Calculate health factor for a position
  static calculateHealthFactor(
    collateral: { [symbol: string]: number },
    debt: { [symbol: string]: number },
    marketData: MarketData
  ): number {
    let totalCollateralValue = 0;
    let totalDebtValue = 0;

    // Calculate collateral value
    for (const [symbol, amount] of Object.entries(collateral)) {
      const asset = marketData.assets[symbol];
      if (asset) {
        totalCollateralValue += amount * asset.price * asset.liquidationThreshold;
      }
    }

    // Calculate debt value
    for (const [symbol, amount] of Object.entries(debt)) {
      const asset = marketData.assets[symbol];
      if (asset) {
        totalDebtValue += amount * asset.price;
      }
    }

    return totalDebtValue > 0 ? totalCollateralValue / totalDebtValue : Infinity;
  }

  // Get liquidation price for a position
  static calculateLiquidationPrice(
    collateral: { [symbol: string]: number },
    debt: { [symbol: string]: number },
    marketData: MarketData
  ): { [symbol: string]: number } {
    const liquidationPrices: { [symbol: string]: number } = {};

    for (const [collateralSymbol, collateralAmount] of Object.entries(collateral)) {
      const collateralAsset = marketData.assets[collateralSymbol];
      if (!collateralAsset) continue;

      let totalDebtValue = 0;
      for (const [debtSymbol, debtAmount] of Object.entries(debt)) {
        const debtAsset = marketData.assets[debtSymbol];
        if (debtAsset) {
          totalDebtValue += debtAmount * debtAsset.price;
        }
      }

      if (collateralAmount > 0) {
        liquidationPrices[collateralSymbol] = totalDebtValue / (collateralAmount * collateralAsset.liquidationThreshold);
      }
    }

    return liquidationPrices;
  }

  // Simulate Aave Graph API call
  private static async fetchFromAaveGraph(chainId: number): Promise<MarketData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
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
        },
        WBTC: {
          symbol: 'WBTC',
          name: 'Wrapped Bitcoin',
          decimals: 8,
          ltv: 0.70,
          liquidationThreshold: 0.75,
          liquidationBonus: 0.05,
          supplyAPY: 0.01,
          borrowAPY: 0.03,
          price: 40000,
          totalSupply: '10000',
          totalBorrow: '5000',
          utilizationRate: 0.5
        }
      },
      lastUpdated: new Date(),
      chainId
    };
  }

  // Fallback market data for offline/error scenarios
  private static getFallbackMarketData(chainId: number): MarketData {
    return {
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
      chainId
    };
  }
} 