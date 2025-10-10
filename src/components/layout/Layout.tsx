import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Layout({ currentPage, onNavigate = () => {} }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Map pathname to sidebar key
  const pathToKey: Record<string, string> = {
    '/dashboard': 'dashboard',
    '/register-land': 'register-land',
    '/my-lands': 'my-lands',
    '/transfer-ownership': 'transfer-ownership',
    '/transaction-history': 'transaction-history',
    '/profile': 'profile',
    '/search-lands': 'search-lands',
    '/my-purchases': 'my-purchases',
    '/pending-registrations': 'pending-registrations',
    '/user-management': 'user-management',
    '/dispute-management': 'dispute-management',
    '/reports': 'reports',
    '/audit-logs': 'audit-logs',
    '/audit-trail': 'audit-trail',
    '/land-verification': 'verification',
  };
  const detectedPage = pathToKey[location.pathname] || 'dashboard';

  if (!isAuthenticated) {
    return <div><Outlet /></div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={detectedPage} onNavigate={onNavigate} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}