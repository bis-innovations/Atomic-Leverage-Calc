import { useState } from 'react';
import { Wallet, Plus, Settings } from 'lucide-react';

interface Wallet {
  id: string;
  address: string;
  balance: string;
  isConnected: boolean;
}

export default function WalletPanel() {
  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: '1',
      address: '0x1234...5678',
      balance: '2.5 ETH',
      isConnected: true
    },
    {
      id: '2', 
      address: '0x8765...4321',
      balance: '1.2 ETH',
      isConnected: false
    }
  ]);

  const handleConnect = () => {
    // Placeholder for wallet connection logic
    console.log('Connecting wallet...');
  };

  return (
    <div className="bg-white p-4 shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-defi-blue" />
            <span className="font-semibold text-gray-700">Connected Wallets</span>
          </div>
          <div className="flex space-x-2">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  wallet.isConnected
                    ? 'bg-defi-green text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {wallet.address} ({wallet.balance})
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleConnect}
            className="bg-defi-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Wallet</span>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 