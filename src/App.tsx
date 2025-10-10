import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
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


function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}


function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };
  return (
    <Routes>
      <Route path="/" element={<Layout currentPage="dashboard" onNavigate={handleNavigate} />}> 
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage onSwitchToRegister={() => { window.location.href = '/register'; }} />} />
        <Route path="register" element={<RegisterPage onSwitchToLogin={() => { window.location.href = '/login'; }} />} />
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard onNavigate={handleNavigate} />
            </PrivateRoute>
          }
        />
        <Route path="register-land" element={<PrivateRoute><RegisterLandPage /></PrivateRoute>} />
        <Route path="search-lands" element={<PrivateRoute><SearchLandsPage /></PrivateRoute>} />
        <Route path="my-lands" element={<PrivateRoute><MyLandsPage /></PrivateRoute>} />
        <Route path="transfer-ownership" element={<PrivateRoute><TransferOwnershipPage /></PrivateRoute>} />
        <Route path="transaction-history" element={<PrivateRoute><TransactionHistoryPage /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><ProfileSettingsPage /></PrivateRoute>} />
        <Route path="my-purchases" element={<PrivateRoute><MyPurchasesPage /></PrivateRoute>} />
        <Route path="pending-registrations" element={<PrivateRoute><PendingRegistrationsPage /></PrivateRoute>} />
        <Route path="user-management" element={<PrivateRoute><UserManagementPage /></PrivateRoute>} />
        <Route path="dispute-management" element={<PrivateRoute><DisputeManagementPage /></PrivateRoute>} />
        <Route path="reports" element={<PrivateRoute><ReportsAnalyticsPage /></PrivateRoute>} />
        <Route path="audit-logs" element={<PrivateRoute><AuditLogsPage /></PrivateRoute>} />
        <Route path="audit-trail" element={<PrivateRoute><AuditTrailPage /></PrivateRoute>} />
        <Route path="land-verification" element={<PrivateRoute><LandVerificationPage /></PrivateRoute>} />
      </Route>
    </Routes>
  );
}

export default App;