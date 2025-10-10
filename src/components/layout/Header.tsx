import { useState } from 'react';
import { Wallet, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { formatAddress } from '../../lib/utils';

export function Header() {
  const { user, logout, connectWallet, isWalletConnected } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LR</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">LandRegistry</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                  <span className="text-gray-400">({user.role.replace('-', ' ')})</span>
                </div>
                
                {user.name && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
                    <Wallet className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {formatAddress(user.name)}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${isWalletConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </div>
                )}

                {!isWalletConnected && (
                  <Button variant="outline" size="sm" onClick={handleConnectWallet}>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}

                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && user && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user.name} ({user.role.replace('-', ' ')})</span>
            </div>
            
            {user.walletAddress && (
              <div className="flex items-center space-x-2">
                <Wallet className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {formatAddress(user.walletAddress)}
                </span>
              </div>
            )}

            {!isWalletConnected && (
              <Button variant="outline" size="sm" onClick={handleConnectWallet} className="w-full">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}