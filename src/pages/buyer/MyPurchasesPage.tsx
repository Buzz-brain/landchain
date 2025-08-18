import React, { useState } from 'react';
import { MapPin, Calendar, Eye, FileText, ExternalLink, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency, formatDate, formatAddress } from '../../lib/utils';

export function MyPurchasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock purchase data
  const purchases = [
    {
      id: 'p1',
      landId: 'LND-2024-003',
      title: 'Sunset Valley Residential Plot',
      location: {
        address: '789 Valley Road, Springfield, IL 62703',
        coordinates: { lat: 39.7901, lng: -89.6440 },
      },
      size: 1.2,
      sizeUnit: 'acres',
      purchasePrice: 180000,
      purchaseDate: '2024-01-25T14:30:00Z',
      previousOwner: 'John Smith',
      status: 'completed',
      blockchainHash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yzab567cde890fgh',
      documents: [
        {
          id: 'd1',
          name: 'Purchase Agreement',
          type: 'deed',
          url: '/docs/purchase-001.pdf',
          ipfsHash: 'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o',
          uploadedAt: '2024-01-25T14:30:00Z',
        },
        {
          id: 'd2',
          name: 'Title Transfer Certificate',
          type: 'certificate',
          url: '/docs/title-001.pdf',
          ipfsHash: 'QmPjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE8p',
          uploadedAt: '2024-01-25T15:00:00Z',
        },
      ],
      ownershipHistory: [
        {
          owner: 'John Smith',
          from: '2020-03-15T10:00:00Z',
          to: '2024-01-25T14:30:00Z',
          transactionHash: '0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yza890bcd123efg',
        },
        {
          owner: 'Current User',
          from: '2024-01-25T14:30:00Z',
          to: null,
          transactionHash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yzab567cde890fgh',
        },
      ],
    },
  ];

  const filteredPurchases = purchases.filter(purchase =>
    purchase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    purchase.landId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    purchase.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
          <p className="text-sm text-gray-600">Properties Owned</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(purchases.reduce((sum, p) => sum + p.purchasePrice, 0))}
                </p>
              </div>
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
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
                  {purchases.reduce((sum, p) => sum + p.size, 0).toFixed(1)}
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
                  {purchases.filter(p => p.status === 'completed').length}
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
                  {formatCurrency(
                    purchases.reduce((sum, p) => sum + p.purchasePrice, 0) /
                    purchases.reduce((sum, p) => sum + p.size, 0)
                  )}
                </p>
              </div>
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-amber-600 font-bold">Ø</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search your purchases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Purchase List */}
      <div className="grid gap-6">
        {filteredPurchases.map((purchase) => (
          <Card key={purchase.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{purchase.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Land ID: {purchase.landId}</p>
                    </div>
                    <Badge variant={getStatusColor(purchase.status) as any}>
                      {purchase.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{purchase.location.address}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Size</p>
                      <p className="font-medium">{purchase.size} {purchase.sizeUnit}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Purchase Price</p>
                      <p className="font-medium">{formatCurrency(purchase.purchasePrice)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Purchase Date</p>
                      <p className="font-medium">{formatDate(purchase.purchaseDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Previous Owner</p>
                      <p className="font-medium">{purchase.previousOwner}</p>
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

      {filteredPurchases.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No purchases found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search criteria' : 'You haven\'t purchased any land properties yet'}
            </p>
            {!searchQuery && (
              <Button>Browse Available Lands</Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Purchase Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedPurchase?.title || 'Purchase Details'}
        size="xl"
      >
        {selectedPurchase && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Property Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Land ID:</span>
                      <span className="font-medium">{selectedPurchase.landId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{selectedPurchase.size} {selectedPurchase.sizeUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Price:</span>
                      <span className="font-medium">{formatCurrency(selectedPurchase.purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per Acre:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedPurchase.purchasePrice / selectedPurchase.size)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <p className="text-sm text-gray-600">{selectedPurchase.location.address}</p>
                  {selectedPurchase.location.coordinates.lat && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedPurchase.location.coordinates.lat}, {selectedPurchase.location.coordinates.lng}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Transaction Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Date:</span>
                      <span className="font-medium">{formatDate(selectedPurchase.purchaseDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Previous Owner:</span>
                      <span className="font-medium">{selectedPurchase.previousOwner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={getStatusColor(selectedPurchase.status) as any}>
                        {selectedPurchase.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Blockchain Verification</h4>
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium text-emerald-800">Verified on Blockchain</span>
                    </div>
                    <p className="text-xs text-emerald-700 font-mono break-all">
                      {selectedPurchase.blockchainHash}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-emerald-700">
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
                {selectedPurchase.documents.map((doc: any) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">IPFS: {doc.ipfsHash.substring(0, 10)}...</p>
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
              <h4 className="font-semibold text-gray-900 mb-3">Ownership History</h4>
              <div className="space-y-3">
                {selectedPurchase.ownershipHistory.map((record: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{record.owner}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(record.from)} - {record.to ? formatDate(record.to) : 'Present'}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {formatAddress(record.transactionHash)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}