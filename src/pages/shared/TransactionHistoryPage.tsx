import { useState, useEffect } from 'react';
import { Calendar, Filter, Download, ExternalLink, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatAddress, formatCurrency } from '../../lib/utils';

export function TransactionHistoryPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalTransactions: 0,
    completed: 0,
    pending: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "";
        let txUrl = '', statsUrl = '';
        if (user?.role === 'landowner') {
          txUrl = `${apiBase}/land/transactions`;
          statsUrl = `${apiBase}/land/transactions/stats`;
        } else if (user?.role === 'buyer') {
          txUrl = `${apiBase}/buyer/transactions`;
          statsUrl = `${apiBase}/buyer/transactions/stats`;
        }
        const [txRes, statsRes] = await Promise.all([
          fetch(txUrl, { credentials: "include" }),
          fetch(statsUrl, { credentials: "include" }),
        ]);
        const txData = await txRes.json();
        const statsData = await statsRes.json();
        if (txRes.ok && Array.isArray(txData.data)) {
          setTransactions(txData.data);
        } else {
          setTransactions([]);
        }
        if (statsRes.ok && statsData.data) {
          setStats(statsData.data);
        } else {
          setStats({
            totalTransactions: 0,
            completed: 0,
            pending: 0,
            totalValue: 0,
          });
        }
      } catch (err) {
        setError("Failed to load transactions.");
        setTransactions([]);
        setStats({
          totalTransactions: 0,
          completed: 0,
          pending: 0,
          totalValue: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "landowner" || user?.role === "buyer") fetchData();
  }, [user]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.landId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.blockchainHash &&
        transaction.blockchainHash
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus =
      filterStatus === "all" || transaction.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "registration":
        return "📝";
      case "transfer":
        return "🔄";
      case "verification":
        return "✅";
      default:
        return "📄";
    }
  };

  const exportTransactions = () => {
    // Mock export functionality
    const csvContent = filteredTransactions.map(t =>
      `${t.id},${t.type},${t.status},${t.timestamp},${t.amount || 'N/A'},${t.blockchainHash || 'N/A'}`
    ).join('\n');

    const blob = new Blob([`ID,Type,Status,Date,Amount,Hash\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction-history.csv';
    a.click();
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">
        Loading transactions...
      </div>
    );
  }
  if (error) {
    return <div className="py-12 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Transaction History
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            View all your blockchain transactions and their status
          </p>
        </div>
        <Button onClick={exportTransactions} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalTransactions}
              </p>
              <p className="text-sm text-gray-600">Total Transactions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {stats.completed}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {stats.pending}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalValue)}
              </p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />

            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="registration">Registration</option>
                <option value="transfer">Transfer</option>
                <option value="verification">Verification</option>
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Transaction
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Hash
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {getTypeIcon(transaction.type)}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.parcelId}
                          </p>
                          <p className="text-sm text-gray-600">
                            Land: {transaction.landId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize text-gray-700">
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {transaction.amount ? (
                        <span className="font-medium text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={getStatusColor(transaction.status) as any}
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {formatDate(transaction.timestamp)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {transaction.blockchainHash ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-gray-600">
                            {formatAddress(transaction.blockchainHash)}
                          </span>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Pending</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedTransactions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No transactions found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredTransactions.length
                )}{" "}
                of {filteredTransactions.length} transactions
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}