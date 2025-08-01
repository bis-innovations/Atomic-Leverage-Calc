import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Transaction } from '../services/walletService';

interface TransactionHistoryProps {
  address?: string;
}

export default function TransactionHistory({ address }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading transactions
    const loadTransactions = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock transaction data
      const mockTransactions: Transaction[] = [
        {
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          from: '0x1234...5678',
          to: '0xAavePool',
          value: '0',
          data: '0x...',
          status: 'success',
          timestamp: Date.now() - 3600000 // 1 hour ago
        },
        {
          hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          from: '0x1234...5678',
          to: '0xUniswapV3',
          value: '0',
          data: '0x...',
          status: 'pending',
          timestamp: Date.now() - 1800000 // 30 minutes ago
        },
        {
          hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
          from: '0x1234...5678',
          to: '0xAavePool',
          value: '0',
          data: '0x...',
          status: 'failed',
          timestamp: Date.now() - 7200000 // 2 hours ago
        }
      ];
      
      setTransactions(mockTransactions);
      setIsLoading(false);
    };

    loadTransactions();
  }, [address]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-defi-green" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-defi-yellow animate-pulse" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-defi-red" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const openExplorer = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-defi-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
        <div className="text-sm text-gray-500">
          {transactions.length} transactions
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((tx, index) => (
            <div
              key={tx.hash}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(tx.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                    {tx.status.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => openExplorer(tx.hash)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-mono">{formatAddress(tx.from)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-mono">{formatAddress(tx.to)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-mono">{tx.value} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="text-gray-500">{formatTimestamp(tx.timestamp)}</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Hash:</span>
                  <span className="font-mono">{formatAddress(tx.hash)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Transactions:</span>
          <span>{transactions.length}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Success Rate:</span>
          <span>
            {Math.round((transactions.filter(tx => tx.status === 'success').length / transactions.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
} 