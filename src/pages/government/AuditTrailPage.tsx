import React, { useState } from 'react';
import { FileText, Search, Filter, Download, Calendar, MapPin, User, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { formatDate, formatAddress, formatCurrency } from '../../lib/utils';

export function AuditTrailPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Mock audit trail data
  const auditRecords = [
    {
      id: 'AT-001',
      type: 'land_registration',
      landId: 'LND-2024-001',
      landTitle: 'Oakwood Estate Plot A',
      timestamp: '2024-01-15T10:00:00Z',
      initiatedBy: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        role: 'landowner',
        walletAddress: '0x742D35CC6131B3C0E5E2F2E3F8A9B2C4F5D6E7F8',
      },
      approvedBy: {
        name: 'Michael Admin',
        email: 'admin@landregistry.gov',
        role: 'administrator',
      },
      status: 'completed',
      blockchainHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      gasUsed: 21000,
      transactionFee: 0.0025,
      value: 125000,
      location: '123 Oak Street, Springfield, IL 62701',
      size: 2.5,
      sizeUnit: 'acres',
      documents: [
        {
          id: 'd1',
          name: 'Property Deed',
          ipfsHash: 'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o',
          verificationStatus: 'verified',
        },
      ],
      changes: [
        {
          field: 'ownership',
          oldValue: null,
          newValue: 'John Smith',
          timestamp: '2024-01-15T10:00:00Z',
        },
        {
          field: 'status',
          oldValue: 'pending',
          newValue: 'registered',
          timestamp: '2024-01-15T10:05:00Z',
        },
      ],
    },
    {
      id: 'AT-002',
      type: 'ownership_transfer',
      landId: 'LND-2024-002',
      landTitle: 'Riverside Commercial Plot',
      timestamp: '2024-01-22T16:45:00Z',
      initiatedBy: {
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        role: 'landowner',
        walletAddress: '0x789C01D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6G7H8',
      },
      transferredTo: {
        name: 'Robert Wilson',
        email: 'robert.wilson@email.com',
        role: 'buyer',
        walletAddress: '0x123A45B6C7D8E9F0A1B2C3D4E5F6G7H8I9J0K1L2',
      },
      status: 'completed',
      blockchainHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      gasUsed: 45000,
      transactionFee: 0.0055,
      value: 250000,
      location: '456 River Avenue, Springfield, IL 62702',
      size: 1.8,
      sizeUnit: 'acres',
      changes: [
        {
          field: 'ownership',
          oldValue: 'Maria Garcia',
          newValue: 'Robert Wilson',
          timestamp: '2024-01-22T16:45:00Z',
        },
        {
          field: 'price',
          oldValue: 250000,
          newValue: 250000,
          timestamp: '2024-01-22T16:45:00Z',
        },
      ],
    },
    {
      id: 'AT-003',
      type: 'document_verification',
      landId: 'LND-2024-001',
      landTitle: 'Oakwood Estate Plot A',
      timestamp: '2024-01-20T14:30:00Z',
      initiatedBy: {
        name: 'Emma Wilson',
        email: 'agent@landregistry.gov',
        role: 'government-agent',
      },
      status: 'completed',
      blockchainHash: '0xdef456789abcdef456789abcdef456789abcdef456789abcdef456789abcdef45',
      gasUsed: 18000,
      transactionFee: 0.002,
      location: '123 Oak Street, Springfield, IL 62701',
      documents: [
        {
          id: 'd1',
          name: 'Property Deed',
          ipfsHash: 'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o',
          verificationStatus: 'verified',
        },
        {
          id: 'd2',
          name: 'Survey Report',
          ipfsHash: 'QmPjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE8p',
          verificationStatus: 'verified',
        },
      ],
      changes: [
        {
          field: 'verification_status',
          oldValue: 'pending',
          newValue: 'verified',
          timestamp: '2024-01-20T14:30:00Z',
        },
      ],
    },
    {
      id: 'AT-004',
      type: 'dispute_resolution',
      landId: 'LND-2024-003',
      landTitle: 'Sunset Valley Residential Plot',
      timestamp: '2024-01-24T11:20:00Z',
      initiatedBy: {
        name: 'Michael Admin',
        email: 'admin@landregistry.gov',
        role: 'administrator',
      },
      status: 'completed',
      blockchainHash: '0x987654321fedcba987654321fedcba987654321fedcba987654321fedcba98',
      gasUsed: 32000,
      transactionFee: 0.004,
      location: '789 Valley Road, Springfield, IL 62703',
      disputeId: 'DIS-001',
      resolution: 'Ownership confirmed for original claimant',
      changes: [
        {
          field: 'dispute_status',
          oldValue: 'open',
          newValue: 'resolved',
          timestamp: '2024-01-24T11:20:00Z',
        },
      ],
    },
  ];

  const filteredRecords = auditRecords.filter(record => {
    const matchesSearch = record.landTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.landId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || record.type === filterType;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  const viewRecordDetails = (record: any) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'land_registration': return 'info';
      case 'ownership_transfer': return 'success';
      case 'document_verification': return 'warning';
      case 'dispute_resolution': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'land_registration': return '📝';
      case 'ownership_transfer': return '🔄';
      case 'document_verification': return '✅';
      case 'dispute_resolution': return '⚖️';
      default: return '📋';
    }
  };

  const exportAuditTrail = () => {
    // Mock export functionality
    const csvContent = filteredRecords.map(record => 
      `${record.id},${record.type},${record.landId},${record.timestamp},${record.status},${record.blockchainHash}`
    ).join('\n');
    
    const blob = new Blob([`ID,Type,Land ID,Timestamp,Status,Blockchain Hash\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-trail.csv';
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-lg text-gray-600 mt-2">
            Comprehensive chronological record of all land record changes and transactions
          </p>
        </div>
        <Button onClick={exportAuditTrail} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Trail
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{auditRecords.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Registrations</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {auditRecords.filter(r => r.type === 'land_registration').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 font-bold">📝</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transfers</p>
                <p className="text-2xl font-bold text-blue-600">
                  {auditRecords.filter(r => r.type === 'ownership_transfer').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">🔄</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(auditRecords.reduce((sum, r) => sum + (r.value || 0), 0))}
                </p>
              </div>
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-amber-600 font-bold">$</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search audit records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="land_registration">Land Registration</option>
                <option value="ownership_transfer">Ownership Transfer</option>
                <option value="document_verification">Document Verification</option>
                <option value="dispute_resolution">Dispute Resolution</option>
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
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Records */}
      <div className="grid gap-6">
        {paginatedRecords.map((record) => (
          <Card key={record.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{getTypeIcon(record.type)}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{record.landTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {record.id} • Land ID: {record.landId}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant={getTypeColor(record.type) as any} className="capitalize">
                        {record.type.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getStatusColor(record.status) as any}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{record.location}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Initiated By</p>
                      <p className="font-medium">{record.initiatedBy.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Timestamp</p>
                      <p className="font-medium">{formatDate(record.timestamp)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gas Used</p>
                      <p className="font-medium">{record.gasUsed?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Value</p>
                      <p className="font-medium">{record.value ? formatCurrency(record.value) : 'N/A'}</p>
                    </div>
                  </div>

                  {record.blockchainHash && (
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-emerald-800">Blockchain Verified</p>
                          <p className="text-xs text-emerald-700 font-mono break-all">
                            {formatAddress(record.blockchainHash)}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 text-emerald-600" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewRecordDetails(record)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Blockchain
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {paginatedRecords.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No audit records found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Record Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedRecord?.landTitle || 'Audit Record Details'}
        size="xl"
      >
        {selectedRecord && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Record Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Record ID:</span>
                      <span className="font-medium">{selectedRecord.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Badge variant={getTypeColor(selectedRecord.type) as any} className="capitalize">
                        {selectedRecord.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={getStatusColor(selectedRecord.status) as any}>
                        {selectedRecord.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timestamp:</span>
                      <span className="font-medium">{formatDate(selectedRecord.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Property Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Land ID:</span>
                      <span className="font-medium">{selectedRecord.landId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium">{selectedRecord.landTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedRecord.location}</span>
                    </div>
                    {selectedRecord.size && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">{selectedRecord.size} {selectedRecord.sizeUnit}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Blockchain Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hash:</span>
                      <span className="font-mono text-xs">{formatAddress(selectedRecord.blockchainHash)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gas Used:</span>
                      <span className="font-medium">{selectedRecord.gasUsed?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction Fee:</span>
                      <span className="font-medium">{selectedRecord.transactionFee} ETH</span>
                    </div>
                    {selectedRecord.value && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-medium">{formatCurrency(selectedRecord.value)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Participants</h4>
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Initiated By</span>
                      </div>
                      <p className="text-sm text-blue-700">{selectedRecord.initiatedBy.name}</p>
                      <p className="text-xs text-blue-600">{selectedRecord.initiatedBy.email}</p>
                    </div>
                    
                    {selectedRecord.approvedBy && (
                      <div className="bg-emerald-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium text-emerald-800">Approved By</span>
                        </div>
                        <p className="text-sm text-emerald-700">{selectedRecord.approvedBy.name}</p>
                        <p className="text-xs text-emerald-600">{selectedRecord.approvedBy.email}</p>
                      </div>
                    )}

                    {selectedRecord.transferredTo && (
                      <div className="bg-amber-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-4 w-4 text-amber-600" />
                          <span className="font-medium text-amber-800">Transferred To</span>
                        </div>
                        <p className="text-sm text-amber-700">{selectedRecord.transferredTo.name}</p>
                        <p className="text-xs text-amber-600">{selectedRecord.transferredTo.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            {selectedRecord.documents && selectedRecord.documents.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedRecord.documents.map((doc: any) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">IPFS: {doc.ipfsHash.substring(0, 10)}...</p>
                          </div>
                        </div>
                        <Badge variant={doc.verificationStatus === 'verified' ? 'success' : 'warning'}>
                          {doc.verificationStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Changes */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Change History</h4>
              <div className="space-y-3">
                {selectedRecord.changes.map((change: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 capitalize">{change.field.replace('_', ' ')}</span>
                        <span className="text-xs text-gray-500">{formatDate(change.timestamp)}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {change.oldValue && (
                          <span className="line-through text-red-600">{change.oldValue}</span>
                        )}
                        {change.oldValue && change.newValue && ' → '}
                        <span className="text-emerald-600 font-medium">{change.newValue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-gray-200">
              <Button variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Blockchain
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export Record
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}