import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, X, Eye, Calendar, MapPin, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { formatDate, formatCurrency } from '../../lib/utils';

export function PendingRegistrationsPage() {
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');

  // Mock pending registrations data
  const pendingRegistrations = [
    {
      id: 'reg-001',
      landId: 'LND-2024-004',
      title: 'Mountain View Estate',
      applicant: {
        name: 'Robert Johnson',
        email: 'robert.johnson@email.com',
        walletAddress: '0x456B78C9D0E1F2A3B4C5D6E7F8G9H0I1J2K3L4M5',
      },
      location: {
        address: '456 Mountain View Drive, Springfield, IL 62704',
        coordinates: { lat: 39.8012, lng: -89.6523 },
      },
      size: 3.5,
      sizeUnit: 'acres',
      estimatedValue: 420000,
      submittedAt: '2024-01-26T09:15:00Z',
      documents: [
        {
          id: 'd1',
          name: 'Property Deed',
          type: 'deed',
          url: '/docs/deed-004.pdf',
          ipfsHash: 'QmXjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE9q',
          uploadedAt: '2024-01-26T09:15:00Z',
        },
        {
          id: 'd2',
          name: 'Survey Report',
          type: 'survey',
          url: '/docs/survey-004.pdf',
          ipfsHash: 'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE0r',
          uploadedAt: '2024-01-26T09:16:00Z',
        },
      ],
      status: 'pending',
      priority: 'high',
    },
    {
      id: 'reg-002',
      landId: 'LND-2024-005',
      title: 'Lakeside Commercial Plot',
      applicant: {
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        walletAddress: '0x789C01D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6G7H8',
      },
      location: {
        address: '789 Lakeside Boulevard, Springfield, IL 62705',
        coordinates: { lat: 39.7756, lng: -89.6234 },
      },
      size: 2.8,
      sizeUnit: 'acres',
      estimatedValue: 350000,
      submittedAt: '2024-01-25T14:22:00Z',
      documents: [
        {
          id: 'd3',
          name: 'Commercial Property Deed',
          type: 'deed',
          url: '/docs/deed-005.pdf',
          ipfsHash: 'QmZjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE1s',
          uploadedAt: '2024-01-25T14:22:00Z',
        },
      ],
      status: 'pending',
      priority: 'medium',
    },
  ];

  const viewRegistrationDetails = (registration: any) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  const handleApprovalAction = (registration: any, action: 'approve' | 'reject') => {
    setSelectedRegistration(registration);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const confirmApprovalAction = () => {
    // Mock approval/rejection logic
    console.log(`${approvalAction}ing registration:`, selectedRegistration?.id);
    setShowApprovalModal(false);
    setSelectedRegistration(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Registrations</h1>
          <p className="text-lg text-gray-600 mt-2">
            Review and approve land registration applications
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-600">{pendingRegistrations.length}</p>
          <p className="text-sm text-gray-600">Pending Review</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingRegistrations.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {pendingRegistrations.filter(r => r.priority === 'high').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
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
                  {formatCurrency(pendingRegistrations.reduce((sum, r) => sum + r.estimatedValue, 0))}
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
                <p className="text-sm text-gray-600 mb-1">Avg. Processing Time</p>
                <p className="text-2xl font-bold text-gray-900">2.5</p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registrations List */}
      <div className="grid gap-6">
        {pendingRegistrations.map((registration) => (
          <Card key={registration.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{registration.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Registration ID: {registration.id}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant={getPriorityColor(registration.priority) as any}>
                        {registration.priority} priority
                      </Badge>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{registration.location.address}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Applicant</p>
                      <p className="font-medium">{registration.applicant.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Size</p>
                      <p className="font-medium">{registration.size} {registration.sizeUnit}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Estimated Value</p>
                      <p className="font-medium">{formatCurrency(registration.estimatedValue)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Submitted</p>
                      <p className="font-medium">{formatDate(registration.submittedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewRegistrationDetails(registration)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleApprovalAction(registration, 'approve')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprovalAction(registration, 'reject')}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pendingRegistrations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No pending registrations to review at this time</p>
          </CardContent>
        </Card>
      )}

      {/* Registration Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedRegistration?.title || 'Registration Details'}
        size="xl"
      >
        {selectedRegistration && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Property Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration ID:</span>
                      <span className="font-medium">{selectedRegistration.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{selectedRegistration.size} {selectedRegistration.sizeUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Value:</span>
                      <span className="font-medium">{formatCurrency(selectedRegistration.estimatedValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submitted:</span>
                      <span className="font-medium">{formatDate(selectedRegistration.submittedAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <p className="text-sm text-gray-600">{selectedRegistration.location.address}</p>
                  {selectedRegistration.location.coordinates.lat && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedRegistration.location.coordinates.lat}, {selectedRegistration.location.coordinates.lng}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Applicant Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedRegistration.applicant.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedRegistration.applicant.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wallet:</span>
                      <span className="font-mono text-xs">{selectedRegistration.applicant.walletAddress}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Priority & Status</h4>
                  <div className="flex space-x-2">
                    <Badge variant={getPriorityColor(selectedRegistration.priority) as any}>
                      {selectedRegistration.priority} priority
                    </Badge>
                    <Badge variant="warning">Pending Review</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Supporting Documents</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {selectedRegistration.documents.map((doc: any) => (
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
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-gray-200">
              <Button
                onClick={() => handleApprovalAction(selectedRegistration, 'approve')}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Registration
              </Button>
              <Button
                variant="outline"
                onClick={() => handleApprovalAction(selectedRegistration, 'reject')}
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Reject Registration
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Approval/Rejection Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title={`${approvalAction === 'approve' ? 'Approve' : 'Reject'} Registration`}
      >
        <div className="space-y-6">
          <div className={`rounded-lg p-4 ${approvalAction === 'approve' ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              {approvalAction === 'approve' ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <X className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${approvalAction === 'approve' ? 'text-emerald-800' : 'text-red-800'}`}>
                {approvalAction === 'approve' ? 'Approve Registration' : 'Reject Registration'}
              </span>
            </div>
            <p className={`text-sm ${approvalAction === 'approve' ? 'text-emerald-700' : 'text-red-700'}`}>
              {approvalAction === 'approve' 
                ? 'This will approve the land registration and deploy it to the blockchain.'
                : 'This will reject the land registration application. The applicant will be notified.'
              }
            </p>
          </div>

          {selectedRegistration && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Registration Summary</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Property:</span> {selectedRegistration.title}</p>
                <p><span className="text-gray-600">Applicant:</span> {selectedRegistration.applicant.name}</p>
                <p><span className="text-gray-600">Value:</span> {formatCurrency(selectedRegistration.estimatedValue)}</p>
              </div>
            </div>
          )}

          {approvalAction === 'reject' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Reason for Rejection (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Provide a reason for rejection..."
              />
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={confirmApprovalAction}
              className={`flex-1 ${approvalAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
              {approvalAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
            <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}