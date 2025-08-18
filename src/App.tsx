import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { Dashboard } from './pages/dashboard/Dashboard';
import { RegisterLandPage } from './pages/land/RegisterLandPage';
import { SearchLandsPage } from './pages/land/SearchLandsPage';
import { MyLandsPage } from './pages/landowner/MyLandsPage';
import { TransferOwnershipPage } from './pages/landowner/TransferOwnershipPage';
import { TransactionHistoryPage } from './pages/shared/TransactionHistoryPage';
import { ProfileSettingsPage } from './pages/shared/ProfileSettingsPage';
import { MyPurchasesPage } from './pages/buyer/MyPurchasesPage';
import { PendingRegistrationsPage } from './pages/admin/PendingRegistrationsPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { DisputeManagementPage } from './pages/admin/DisputeManagementPage';
import { ReportsAnalyticsPage } from './pages/admin/ReportsAnalyticsPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { AuditTrailPage } from './pages/government/AuditTrailPage';
import { LandVerificationPage } from './pages/government/LandVerificationPage';

type AppState = 'landing' | 'login' | 'register' | 'dashboard';
type PageState = string;

function AppContent() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentPage, setCurrentPage] = useState<PageState>('dashboard');
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    setAppState('login');
  };

  const handleNavigate = (page: PageState) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      switch (appState) {
        case 'landing':
          return <LandingPage onGetStarted={handleGetStarted} />;
        case 'login':
          return <LoginPage onSwitchToRegister={() => setAppState('register')} />;
        case 'register':
          return <RegisterPage onSwitchToLogin={() => setAppState('login')} />;
        default:
          return <LandingPage onGetStarted={handleGetStarted} />;
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'register-land':
        return <RegisterLandPage />;
      case 'search-lands':
        return <SearchLandsPage />;
      case 'my-lands':
        return <MyLandsPage />;
      case 'transfer-ownership':
        return <TransferOwnershipPage />;
      case 'transaction-history':
        return <TransactionHistoryPage />;
      case 'profile':
        return <ProfileSettingsPage />;
      case 'my-purchases':
        return <MyPurchasesPage />;
      case 'pending-registrations':
        return <PendingRegistrationsPage />;
      case 'user-management':
        return <UserManagementPage />;
      case 'dispute-management':
        return <DisputeManagementPage />;
      case 'reports':
        return <ReportsAnalyticsPage />;
      case 'audit-logs':
        return <AuditLogsPage />;
      case 'audit-trail':
        return <AuditTrailPage />;
      case 'land-verification':
        return <LandVerificationPage />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;