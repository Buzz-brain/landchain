import React, { useState } from 'react';
import { Search, Shield, MapPin, FileText, ExternalLink, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { mockLands } from '../../lib/mock-data';
import { formatDate, formatCurrency, formatAddress } from '../../lib/utils';

export function LandVerificationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');

  // Extended mock data with verification details
  const extendedLands = mockLands.map(land => ({
    ...land,
    verificationDetails: {
      blockchainVerified: true,
      documentsVerified: true,
      ownershipVerified: true,
      locationVerified: true,
      lastVerified: '2024-01-26T10:30:00Z',
      verifiedBy: 'Emma Wilson',
      verificationScore: 98,
      riskLevel: 'low',
    },
    ownershipHistory: [
      {
        owner: land.currentOwner === '1' ? 'John Smith' : 'Maria Garcia',
        from: land.registrationDate,
        to: null,
        transactionHash: land.blockchainHash,
        verified: true,
      },
    ],
    complianceChecks: {
      taxCompliance: true,
      zoning: true,
      environmentalClearance: true,
      buildingPermits: true,
      liens: false,
    },
  }));

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Mock search delay
    setTimeout(() => {
      const results = extendedLands.filter(land =>
        land.parcelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        land.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        land.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const verifyLand = async (land: any) => {
    setSelectedLand(land);
    setVerificationStatus('verifying');
    
    // Mock verification process
    setTimeout(() => {
      setVerificationStatus('verified');
    }, 2000);
  };

  const viewLandDetails = (land: any) => {
    setSelectedLand(land);
    setShowDetailsModal(true);
  };

  const getVerificationColor = (score: number) => {
    if (score >= 95) return 'success';
    if (score >= 80) return 'warning';
    return 'error';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Land Verification</h1>
        <p className="text-lg text-gray-600">
          Search and verify land ownership details with blockchain hash verification
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Property Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Enter Parcel ID, property title, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} loading={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Search Tips:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Use the complete Parcel ID for exact matches (e.g., LND-2024-001)</li>
              <li>Search by property title or partial address</li>
              <li>All searches are case-insensitive</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((land) => (
                <div key={land.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{land.title}</h3>
                          <p className="text-sm text-gray-600">Parcel ID: {land.parcelId}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={getVerificationColor(land.verificationDetails.verificationScore) as any}>
                            {land.verificationDetails.verificationScore}% Verified
                          </Badge>
                          <Badge variant={getRiskColor(land.verificationDetails.riskLevel) as any}>
                            {land.verificationDetails.riskLevel} risk
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{land.location.address}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Current Owner</p>
                          <p className="font-medium">
                            {land.currentOwner === '1' ? 'John Smith' : 'Maria Garcia'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Size</p>
                          <p className="font-medium">{land.size} {land.sizeUnit}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Registered</p>
                          <p className="font-medium">{formatDate(land.registrationDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Value</p>
                          <p className="font-medium">{land.price ? formatCurrency(land.price) : 'N/A'}</p>
                        </div>
                      </div>

                      {/* Verification Status Indicators */}
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          {land.verificationDetails.blockchainVerified ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-gray-600">Blockchain</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {land.verificationDetails.documentsVerified ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-gray-600">Documents</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {land.verificationDetails.ownershipVerified ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-gray-600">Ownership</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {land.verificationDetails.locationVerified ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-gray-600">Location</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewLandDetails(land)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => verifyLand(land)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Re-verify
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {searchResults.length === 0 && searchQuery && !isSearching && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">
              No properties match your search criteria. Please check the Parcel ID or try a different search term.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Verification Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{extendedLands.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Fully Verified</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {extendedLands.filter(l => l.verificationDetails.verificationScore >= 95).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Risk</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {extendedLands.filter(l => l.verificationDetails.riskLevel === 'low').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Needs Review</p>
                <p className="text-2xl font-bold text-amber-600">
                  {extendedLands.filter(l => l.verificationDetails.verificationScore < 95).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Land Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedLand?.title || 'Property Verification Details'}
        size="xl"
      >
        {selectedLand && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Property Information</h4>
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
                      <span className="text-gray-600">Current Owner:</span>
                      <span className="font-medium">
                        {selectedLand.currentOwner === '1' ? 'John Smith' : 'Maria Garcia'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registered:</span>
                      <span className="font-medium">{formatDate(selectedLand.registrationDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium">{selectedLand.price ? formatCurrency(selectedLand.price) : 'N/A'}</span>
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
                  <h4 className="font-semibold text-gray-900 mb-2">Verification Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Overall Score</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full" 
                            style={{ width: `${selectedLand.verificationDetails.verificationScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {selectedLand.verificationDetails.verificationScore}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        {selectedLand.verificationDetails.blockchainVerified ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                        <span>Blockchain</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedLand.verificationDetails.documentsVerified ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                        <span>Documents</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedLand.verificationDetails.ownershipVerified ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                        <span>Ownership</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedLand.verificationDetails.locationVerified ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                        <span>Location</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Last verified: {formatDate(selectedLand.verificationDetails.lastVerified)} by {selectedLand.verificationDetails.verifiedBy}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Risk Assessment</h4>
                  <Badge variant={getRiskColor(selectedLand.verificationDetails.riskLevel) as any} className="capitalize">
                    {selectedLand.verificationDetails.riskLevel} Risk
                  </Badge>
                </div>
              </div>
            </div>

            {/* Blockchain Verification */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Blockchain Verification</h4>
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium text-emerald-800">Verified on Blockchain</span>
                </div>
                <p className="text-xs text-emerald-700 font-mono break-all mb-2">
                  {selectedLand.blockchainHash}
                </p>
                <Button variant="ghost" size="sm" className="text-emerald-700 p-0 h-auto">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on Block Explorer
                </Button>
              </div>
            </div>

            {/* Compliance Checks */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Compliance Checks</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {Object.entries(selectedLand.complianceChecks).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    {value ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
              <div className="space-y-2">
                {selectedLand.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">IPFS: {doc.ipfsHash.substring(0, 10)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success">Verified</Badge>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-gray-200">
              <Button className="flex-1">
                <Shield className="h-4 w-4 mr-2" />
                Re-verify Property
              </Button>
              <Button variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Report
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Verification Process Modal */}
      <Modal
        isOpen={verificationStatus === 'verifying' || verificationStatus === 'verified'}
        onClose={() => setVerificationStatus('idle')}
        title="Property Verification"
      >
        <div className="text-center space-y-4">
          {verificationStatus === 'verifying' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Verifying Property
                </h3>
                <p className="text-gray-600">
                  Running comprehensive verification checks...
                </p>
              </div>
            </>
          )}

          {verificationStatus === 'verified' && (
            <>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Verification Complete
                </h3>
                <p className="text-gray-600 mb-4">
                  Property has been successfully verified with a score of 98%.
                </p>
                <Button onClick={() => setVerificationStatus('idle')} className="w-full">
                  Continue
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}