import React, { useState } from 'react';
import { Search, MapPin, Filter, Eye, Heart, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { mockLands } from '../../lib/mock-data';
import { formatCurrency, formatDate } from '../../lib/utils';

export function SearchLandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    minSize: '',
    maxSize: '',
    sizeUnit: 'acres',
    minPrice: '',
    maxPrice: '',
    status: 'all',
  });

  const availableLands = mockLands.filter(land => land.isForSale);

  const filteredLands = availableLands.filter(land => {
    const matchesSearch = land.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         land.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         land.parcelId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = true; // Simplified for demo
    
    return matchesSearch && matchesFilters;
  });

  const viewLandDetails = (land: any) => {
    setSelectedLand(land);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Available Lands</h1>
        <p className="text-lg text-gray-600">
          Discover verified land properties available for purchase
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by title, parcel ID, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <Input
                label="Min Size"
                type="number"
                placeholder="0"
                value={filters.minSize}
                onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
              />
              <Input
                label="Max Size"
                type="number"
                placeholder="100"
                value={filters.maxSize}
                onChange={(e) => setFilters({ ...filters, maxSize: e.target.value })}
              />
              <Input
                label="Min Price ($)"
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
              <Input
                label="Max Price ($)"
                type="number"
                placeholder="1000000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {filteredLands.length} properties found
              </p>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLands.map((land) => (
          <Card key={land.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{land.title}</CardTitle>
                <Badge variant={land.status === 'registered' ? 'success' : 'warning'}>
                  {land.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">{land.location.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Size</p>
                  <p className="font-medium">{land.size} {land.sizeUnit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Parcel ID</p>
                  <p className="font-medium">{land.parcelId}</p>
                </div>
              </div>

              {land.price && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="text-lg font-bold text-emerald-600">
                      {formatCurrency(land.price)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(land.price / land.size)}/{land.sizeUnit}
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewLandDetails(land)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLands.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Land Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedLand?.title || 'Land Details'}
        size="xl"
      >
        {selectedLand && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parcel ID:</span>
                      <span className="font-medium">{selectedLand.parcelId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{selectedLand.size} {selectedLand.sizeUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registered:</span>
                      <span className="font-medium">{formatDate(selectedLand.registrationDate)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <p className="text-sm text-gray-600">{selectedLand.location.address}</p>
                  {selectedLand.location.coordinates.lat && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedLand.location.coordinates.lat}, {selectedLand.location.coordinates.lng}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Blockchain Verification</h4>
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium text-emerald-800">Verified on Blockchain</span>
                    </div>
                    <p className="text-xs text-emerald-700 font-mono break-all">
                      {selectedLand.blockchainHash}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
                  <div className="space-y-2">
                    {selectedLand.documents.map((doc: any) => (
                      <div key={doc.id} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{doc.name}</span>
                        <Badge variant="info" className="text-xs">IPFS</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {selectedLand.price && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedLand.price)}</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(selectedLand.price / selectedLand.size)} per {selectedLand.sizeUnit}
                    </p>
                  </div>
                  <Badge variant="success" className="text-lg px-4 py-2">For Sale</Badge>
                </div>
                <div className="flex space-x-4">
                  <Button className="flex-1">
                    Initiate Purchase
                  </Button>
                  <Button variant="outline">
                    Contact Owner
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}