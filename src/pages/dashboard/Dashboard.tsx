import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  TrendingUp, 
  Clock, 
  Shield, 
  Plus, 
  Search,
  AlertTriangle,
  FileText,
  Users,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../lib/utils';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      navigate(`/${page}`);
    }
  };
  const { user } = useAuth();
  const [landStats, setLandStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (user?.role === 'landowner' || user?.role === 'buyer') {
      const fetchStats = async () => {
        setLoadingStats(true);
        try {
          const apiBase = import.meta.env.VITE_API_BASE_URL || '';
          let url = '';
          if (user.role === 'landowner') {
            url = `${apiBase}/land/owner/stats`;
          } else if (user.role === 'buyer') {
            url = `${apiBase}/buyer/land-stats`;
          }
          const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
          });
          const data = await res.json();
          if (res.ok && data.data) {
            setLandStats(data.data);
          } else {
            setLandStats(null);
          }
        } catch (err) {
          setLandStats(null);
        } finally {
          setLoadingStats(false);
        }
      };
      fetchStats();
    }
  }, [user]);

  // Define stats and quickActions for each role
  let stats: any[] = [];
  let quickActions: any[] = [];
  if (user?.role === 'landowner') {
    stats = [
      { label: 'Total Lands', value: landStats?.totalLands ?? '-', icon: MapPin, color: 'text-blue-600' },
      { label: 'Total Value', value: typeof landStats?.totalValue === 'number' ? formatCurrency(landStats.totalValue) : '-', icon: TrendingUp, color: 'text-emerald-600' },
      { label: 'For Sale', value: landStats?.landsForSale ?? '-', icon: Clock, color: 'text-amber-600' },
      { label: 'Verified', value: landStats?.verifiedLands ?? '-', icon: Shield, color: 'text-emerald-600' },
    ];
    quickActions = [
      { label: 'Register New Land', action: 'register-land', icon: Plus },
      { label: 'Transfer Ownership', action: 'transfer-ownership', icon: FileText },
    ];
  } else if (user?.role === 'buyer') {
    stats = [
      { label: 'Available Lands', value: landStats?.availableLands ?? '-', icon: MapPin, color: 'text-blue-600' },
      { label: 'Saved Searches', value: landStats?.savedSearches ?? '-', icon: Search, color: 'text-emerald-600' },
      { label: 'My Purchases', value: landStats?.myPurchases ?? '-', icon: FileText, color: 'text-amber-600' },
      { label: 'Watchlist', value: landStats?.watchlist ?? '-', icon: Clock, color: 'text-blue-600' },
    ];
    quickActions = [
      { label: 'Search Lands', action: 'search-lands', icon: Search },
      { label: 'View Purchases', action: 'my-purchases', icon: FileText },
    ];
  } else if (user?.role === 'administrator') {
    stats = [
      { label: 'Pending Registrations', value: '5', icon: AlertTriangle, color: 'text-amber-600' },
      { label: 'Active Users', value: '248', icon: Users, color: 'text-blue-600' },
      { label: 'Open Disputes', value: '2', icon: Shield, color: 'text-red-600' },
      { label: 'Total Lands', value: '150', icon: MapPin, color: 'text-emerald-600' },
    ];
    quickActions = [
      { label: 'Review Registrations', action: 'pending-registrations', icon: AlertTriangle },
      { label: 'Generate Reports', action: 'reports', icon: BarChart3 },
    ];
  } else if (user?.role === 'government-agent') {
    stats = [
      { label: 'Total Transactions', value: '1,234', icon: TrendingUp, color: 'text-blue-600' },
      { label: 'Verified Records', value: '150', icon: Shield, color: 'text-emerald-600' },
      { label: 'Audit Trails', value: '89', icon: FileText, color: 'text-amber-600' },
      { label: 'Reports Generated', value: '12', icon: BarChart3, color: 'text-blue-600' },
    ];
    quickActions = [
      { label: 'View Audit Trail', action: 'audit-trail', icon: FileText },
      { label: 'Generate Report', action: 'reports', icon: BarChart3 },
    ];
  }

  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role === 'landowner' || user?.role === 'buyer') {
      const fetchTransactions = async () => {
        try {
          const apiBase = import.meta.env.VITE_API_BASE_URL || '';
          let url = '';
          if (user.role === 'landowner') {
            url = `${apiBase}/land/transactions`;
          } else if (user.role === 'buyer') {
            url = `${apiBase}/buyer/transactions`;
          }
          const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
          });
          const data = await res.json();
          if (res.ok && Array.isArray(data.data)) {
            setRecentTransactions(data.data.slice(0, 2));
          } else {
            setRecentTransactions([]);
          }
        } catch (err) {
          setRecentTransactions([]);
        }
      };
      fetchTransactions();
    }
  }, [user]);

  function LandPortfolio() {
    const { user } = useAuth();
    const [lands, setLands] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!user) return;
      const fetchLands = async () => {
        setLoading(true);
        try {
          const apiBase = import.meta.env.VITE_API_BASE_URL || "";
          const res = await fetch(`${apiBase}/land`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok && Array.isArray(data.data)) {
            // Only show lands owned by the current user
            const owned = data.data.filter(
              (land: any) => land.currentOwner?._id === user.id
            );
            setLands(owned.slice(0, 2));
          } else {
            setLands([]);
          }
        } catch (err) {
          setLands([]);
        } finally {
          setLoading(false);
        }
      };
      fetchLands();
    }, [user]);

    if (loading) {
      return (
        <div className="text-gray-500 text-center py-8">
          Loading portfolio...
        </div>
      );
    }
    if (!lands.length) {
      return (
        <div className="text-gray-500 text-center py-8">
          No lands found in your portfolio.
        </div>
      );
    }

    return (
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {lands.map((land) => (
            <div
              key={land._id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{land.title}</h3>
                <Badge
                  variant={land.status === "registered" ? "success" : "warning"}
                >
                  {land.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {land.location?.address}
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {land.size} {land.sizeUnit}
                </span>
                <span className="font-medium text-gray-900">
                  {land.price ? formatCurrency(land.price) : "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100 text-lg">
          {user?.role === 'landowner' && "Manage your land portfolio with confidence"}
          {user?.role === 'buyer' && "Discover and purchase verified land properties"}
          {user?.role === 'administrator' && "Oversee platform operations and user management"}
          {user?.role === 'government-agent' && "Monitor and audit blockchain land transactions"}
        </p>
      </div>

      {/* Statistics Cards */}
      {loadingStats ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-gray-500 text-lg">Loading stats...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleNavigate(action.action)}
                className="w-full justify-start"
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length === 0 && (
                <div className="text-gray-500 text-center py-8">No recent transactions found.</div>
              )}
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Transaction
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.timestamp ? formatDate(transaction.timestamp) : ''}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={transaction.status === 'completed' ? 'success' : 'warning'}
                  >
                    {transaction.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button 
                variant="ghost" 
                onClick={() => handleNavigate('transaction-history')}
                className="w-full"
              >
                View All Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-specific content */}
      {user?.role === 'landowner' && (
        <Card>
          <CardHeader>
            <CardTitle>My Land Portfolio</CardTitle>
          </CardHeader>
          {/* Fetch and display latest two lands for the current owner */}
          <LandPortfolio />
        </Card>
      )}
    </div>
  );
}