import React, { useState } from 'react';
import { MapPin, Calendar, Eye, FileText, ExternalLink, Search } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency, formatDate, formatAddress } from '../../lib/utils';


export function MyPurchasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState<any>({
    totalInvestment: 0,
    totalArea: 0,
    completed: 0,
    avgPricePerAcre: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);


  const [purchases, setPurchases] = useState<any[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [errorPurchases, setErrorPurchases] = useState<string | null>(null);

  // Fetch purchases from backend
  React.useEffect(() => {
    setLoadingPurchases(true);
    setErrorPurchases(null);
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    fetch(`${apiBase}/buyer/my-purchases`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setPurchases(Array.isArray(data?.data) ? data.data : []);
        setLoadingPurchases(false);
      })
      .catch(() => {
        setPurchases([]);
        setErrorPurchases('Failed to load purchases.');
        setLoadingPurchases(false);
      });
  }, []);

  // Fetch purchase stats from backend
  React.useEffect(() => {
    setLoadingStats(true);
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    fetch(`${apiBase}/buyer/my-purchases/stats`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data?.data) setStats(data.data);
        setLoadingStats(false);
      })
      .catch(() => {
        setStats({ totalInvestment: 0, totalArea: 0, completed: 0, avgPricePerAcre: 0 });
        setLoadingStats(false);
      });
  }, []);

  const filteredPurchases = purchases.filter(purchase => {
    const q = searchQuery.toLowerCase();
    const title = (purchase.title || '').toLowerCase();
    const parcelId = (purchase.parcelId || '').toLowerCase();
    const landId = (purchase.landId || '').toLowerCase();
    const address = (purchase.location?.address || '').toLowerCase();
    return (
      title.includes(q) ||
      parcelId.includes(q) ||
      landId.includes(q) ||
      address.includes(q)
    );
  });

  const viewPurchaseDetails = (purchase: any) => {
    setSelectedPurchase(purchase);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (

    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Purchases</h1>
          <p className="text-lg text-gray-600 mt-2">
            View and manage your purchased land properties
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          <p className="text-sm text-gray-600">Properties Owned</p>
        </div>
      </div>

      {/* Summary Cards */}
      {loadingStats ? (
        <div className="text-center text-blue-600 py-8">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalInvestment)}
                  </p>
                </div>
                <div className="w-5 h-5 p-2 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 font-bold">$</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Area</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalArea}
                  </p>
                  <p className="text-xs text-gray-500">acres</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completed}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg. Price/Acre</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.avgPricePerAcre)}
                  </p>
                </div>
                <div className="w-5 h-5 p-2 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600 font-bold">Ø</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <Input
            placeholder="Search your purchases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-5 w-5" />}
          />
        </CardContent>
      </Card>

      {/* Purchase List */}
      {loadingPurchases && (
        <div className="text-center text-blue-600 py-8">
          Loading purchases...
        </div>
      )}
      {errorPurchases && (
        <div className="text-center text-red-600 py-8">{errorPurchases}</div>
      )}
      <div className="grid gap-6">
        {filteredPurchases.map((purchase) => (
          <Card
            key={purchase._id || purchase.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {purchase.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Parcel ID: {purchase.parcelId}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(purchase.status) as any}>
                      {purchase.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      {purchase.location?.address}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Size</p>
                      <p className="font-medium">
                        {purchase.size} {purchase.sizeUnit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium">
                        {formatCurrency(purchase.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Registration Date</p>
                      <p className="font-medium">
                        {formatDate(purchase.registrationDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Current Owner</p>
                      <p className="font-medium">{purchase.currentOwner}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewPurchaseDetails(purchase)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPurchases.length === 0 &&
        !loadingPurchases &&
        !errorPurchases && (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No purchases found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "You haven't purchased any land properties yet"}
              </p>
              {!searchQuery && <Button>Browse Available Lands</Button>}
            </CardContent>
          </Card>
        )}

      {/* Purchase Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedPurchase?.title || "Purchase Details"}
        size="xl"
      >
        {selectedPurchase && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Property Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Land ID:</span>
                      <span className="font-medium">
                        {selectedPurchase.parcelId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">
                        {selectedPurchase.size} {selectedPurchase.sizeUnit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Price:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedPurchase.purchasePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per Acre:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          selectedPurchase.purchasePrice / selectedPurchase.size
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <p className="text-sm text-gray-600">
                    {selectedPurchase.location.address}
                  </p>
                  {selectedPurchase.location.coordinates.lat && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedPurchase.location.coordinates.lat},{" "}
                      {selectedPurchase.location.coordinates.lng}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Transaction Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Date:</span>
                      <span className="font-medium">
                        {selectedPurchase.purchaseDate
                          ? formatDate(selectedPurchase.purchaseDate)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Previous Owner:</span>
                      <span className="font-medium">
                        {selectedPurchase.previousOwners}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge
                        variant={getStatusColor(selectedPurchase.status) as any}
                      >
                        {selectedPurchase.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Blockchain Verification
                  </h4>
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium text-emerald-800">
                        Verified on Blockchain
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 font-mono break-all">
                      {selectedPurchase.blockchainHash}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 p-0 h-auto text-emerald-700"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View on Explorer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Documents */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {(selectedPurchase.documents || []).map((doc: any, idx: number) => (
                  <div
                    key={doc._id || doc.id || doc.ipfsHash || idx}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            IPFS: {doc.ipfsHash.substring(0, 10)}...
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Ownership History */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Ownership History
              </h4>
              <div className="space-y-3">
                {(selectedPurchase.previousOwners || []).map(
                  (record: any, index: number) => (
                    <div
                      key={record._id || record.owner || index}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {record.owner}
                        </p>
                        <p className="text-sm text-gray-600">
                          {(record.from ? formatDate(record.from) : 'N/A')} - {record.to ? formatDate(record.to) : "Present"}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">
                          {formatAddress(record.transactionHash)}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}