import React from 'react';
import { 
  Home, 
  Plus, 
  Search, 
  ArrowRightLeft, 
  History, 
  BarChart3, 
  Settings, 
  Shield,
  FileText,
  Users,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { key: 'dashboard', label: 'Dashboard', icon: Home },
      { key: 'profile', label: 'Profile & Settings', icon: Settings },
    ];

    switch (user?.role) {
      case 'landowner':
        return [
          ...baseItems.slice(0, 1),
          { key: 'register-land', label: 'Register Land', icon: Plus },
          { key: 'my-lands', label: 'My Lands', icon: FileText },
          { key: 'transfer-ownership', label: 'Transfer Ownership', icon: ArrowRightLeft },
          { key: 'transaction-history', label: 'Transaction History', icon: History },
          ...baseItems.slice(1),
        ];

      case 'buyer':
        return [
          ...baseItems.slice(0, 1),
          { key: 'search-lands', label: 'Search Lands', icon: Search },
          { key: 'my-purchases', label: 'My Purchases', icon: FileText },
          { key: 'transaction-history', label: 'Transaction History', icon: History },
          ...baseItems.slice(1),
        ];

      case 'administrator':
        return [
          ...baseItems.slice(0, 1),
          { key: 'pending-registrations', label: 'Pending Registrations', icon: AlertTriangle },
          { key: 'user-management', label: 'User Management', icon: Users },
          { key: 'dispute-management', label: 'Dispute Management', icon: Shield },
          { key: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          { key: 'audit-logs', label: 'Audit Logs', icon: History },
          ...baseItems.slice(1),
        ];

      case 'government-agent':
        return [
          ...baseItems.slice(0, 1),
          { key: 'audit-trail', label: 'Audit Trail', icon: History },
          { key: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          { key: 'verification', label: 'Land Verification', icon: Shield },
          ...baseItems.slice(1),
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            
            return (
              <li key={item.key}>
                <button
                  onClick={() => onNavigate(item.key)}
                  className={cn(
                    'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className={cn('h-5 w-5 mr-3', isActive ? 'text-blue-700' : 'text-gray-400')} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}