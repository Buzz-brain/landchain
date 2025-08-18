import React, { useState } from 'react';
import { AlertTriangle, Eye, MessageSquare, CheckCircle, X, Calendar, User, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { formatDate, formatCurrency } from '../../lib/utils';

export function DisputeManagementPage() {
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionAction, setResolutionAction] = useState<'resolve' | 'escalate'>('resolve');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Mock dispute data
  const disputes = [
    {
      id: 'DIS-001',
      title: 'Ownership Verification Dispute',
      landId: 'LND-2024-001',
      landTitle: 'Oakwood Estate Plot A',
      disputant: {
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        role: 'buyer',
      },
      respondent: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        role: 'landowner',
      },
      category: 'ownership',
      priority: 'high',
      status: 'open',
      description: 'Buyer claims that the ownership documents provided do not match the blockchain records. Requesting verification of the property deed and survey documents.',
      submittedAt: '2024-01-24T09:15:00Z',
      lastUpdated: '2024-01-25T14:30:00Z',
      evidence: [
        {
          id: 'ev1',
          name: 'Original Property Deed',
          type: 'document',
          uploadedBy: 'Alice Johnson',
          uploadedAt: '2024-01-24T09:15:00Z',
        },
        {
          id: 'ev2',
          name: 'Blockchain Transaction Hash',
          type: 'blockchain',
          uploadedBy: 'Alice Johnson',
          uploadedAt: '2024-01-24T09:16:00Z',
        },
      ],
      messages: [
        {
          id: 'm1',
          sender: 'Alice Johnson',
          message: 'The ownership documents provided do not match what is recorded on the blockchain.',
          timestamp: '2024-01-24T09:15:00Z',
        },
        {
          id: 'm2',
          sender: 'John Smith',
          message: 'I have provided all the correct documentation. Please verify the IPFS hashes.',
          timestamp: '2024-01-24T15:30:00Z',
        },
      ],
      estimatedValue: 125000,
    },
    {
      id: 'DIS-002',
      title: 'Transfer Transaction Failed',
      landId: 'LND-2024-002',
      landTitle: 'Riverside Commercial Plot',
      disputant: {
        name: 'Robert Wilson',
        email: 'robert.wilson@email.com',
        role: 'buyer',
      },
      respondent: {
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        role: 'landowner',
      },
      category: 'transaction',
      priority: 'medium',
      status: 'investigating',
      description: 'Payment was processed but ownership transfer failed on the blockchain. Funds are locked in escrow.',
      submittedAt: '2024-01-23T16:45:00Z',
      lastUpdated: '2024-01-26T10:20:00Z',
      evidence: [
        {
          id: 'ev3',
          name: 'Payment Receipt',
          type: 'document',
          uploadedBy: 'Robert Wilson',
          uploadedAt: '2024-01-23T16:45:00Z',
        },
      ],
      messages: [
        {
          id: 'm3',
          sender: 'Robert Wilson',
          message: 'I made the payment but the ownership was not transferred. Please help resolve this.',
          timestamp: '2024-01-23T16:45:00Z',
        },
      ],
      estimatedValue: 250000,
    },
  ];

  const viewDisputeDetails = (dispute: any) => {
    setSelectedDispute(dispute);
    setShowDetailsModal(true);
  };

  const handleResolution = (dispute: any, action: 'resolve' | 'escalate') => {
    setSelectedDispute(dispute);
    setResolutionAction(action);
    setShowResolutionModal(true);
  };

  const confirmResolution = () => {
    // Mock resolution logic
    console.log(`${resolutionAction}ing dispute:`, selectedDispute?.id, resolutionNotes);
    setShowResolutionModal(false);
    setSelectedDispute(null);
    setResolutionNotes('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'error';
      case 'investigating': return 'warning';
      case 'resolved': return 'success';
      case 'escalated': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ownership': return FileText;
      case 'transaction': return AlertTriangle;
      case 'verification': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispute Management</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage and resolve land ownership disputes
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-red-600">{disputes.filter(d => d.status === 'open').length}</p>
          <p className="text-sm text-gray-600">Open Disputes</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Disputes</p>
                <p className="text-2xl font-bold text-gray-900">{disputes.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Open</p>
                <p className="text-2xl font-bold text-red-600">
                  {disputes.filter(d => d.status === 'open').length}
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
                <p className="text-sm text-gray-600 mb-1">Investigating</p>
                <p className="text-2xl font-bold text-amber-600">
                  {disputes.filter(d => d.status === 'investigating').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-amber-600 font-bold">?</span>
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
                  {formatCurrency(disputes.reduce((sum, d) => sum + d.estimatedValue, 0))}
                </p>
              </div>
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 font-bold">$</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disputes List */}
      <div className="grid gap-6">
        {disputes.map((dispute) => {
          const CategoryIcon = getCategoryIcon(dispute.category);
          return (
            <Card key={dispute.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{dispute.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">Dispute ID: {dispute.id}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={getPriorityColor(dispute.priority) as any}>
                          {dispute.priority} priority
                        </Badge>
                        <Badge variant={getStatusColor(dispute.status) as any}>
                          {dispute.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-2">{dispute.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Property</p>
                        <p className="font-medium">{dispute.landTitle}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Disputant</p>
                        <p className="font-medium">{dispute.disputant.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Value</p>
                        <p className="font-medium">{formatCurrency(dispute.estimatedValue)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Submitted</p>
                        <p className="font-medium">{formatDate(dispute.submittedAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewDisputeDetails(dispute)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleResolution(dispute, 'resolve')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolution(dispute, 'escalate')}
                      className="text-amber-600 border-amber-200 hover:bg-amber-50"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Escalate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {disputes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No active disputes</h3>
            <p className="text-gray-600">All disputes have been resolved</p>
          </CardContent>
        </Card>
      )}

      {/* Dispute Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedDispute?.title || 'Dispute Details'}
        size="xl"
      >
        {selectedDispute && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Dispute Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dispute ID:</span>
                      <span className="font-medium">{selectedDispute.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{selectedDispute.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <Badge variant={getPriorityColor(selectedDispute.priority) as any}>
                        {selectedDispute.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={getStatusColor(selectedDispute.status) as any}>
                        {selectedDispute.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submitted:</span>
                      <span className="font-medium">{formatDate(selectedDispute.submittedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{formatDate(selectedDispute.lastUpdated)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Property Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Land ID:</span>
                      <span className="font-medium">{selectedDispute.landId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property:</span>
                      <span className="font-medium">{selectedDispute.landTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Value:</span>
                      <span className="font-medium">{formatCurrency(selectedDispute.estimatedValue)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Parties Involved</h4>
                  <div className="space-y-3">
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">Disputant</span>
                      </div>
                      <p className="text-sm text-red-700">{selectedDispute.disputant.name}</p>
                      <p className="text-xs text-red-600">{selectedDispute.disputant.email}</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Respondent</span>
                      </div>
                      <p className="text-sm text-blue-700">{selectedDispute.respondent.name}</p>
                      <p className="text-xs text-blue-600">{selectedDispute.respondent.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{selectedDispute.description}</p>
              </div>
            </div>

            {/* Evidence */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Evidence</h4>
              <div className="space-y-2">
                {selectedDispute.evidence.map((evidence: any) => (
                  <div key={evidence.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{evidence.name}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded by {evidence.uploadedBy} on {formatDate(evidence.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Communication</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedDispute.messages.map((message: any) => (
                  <div key={message.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{message.sender}</span>
                      <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-gray-200">
              <Button
                onClick={() => handleResolution(selectedDispute, 'resolve')}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolve Dispute
              </Button>
              <Button
                variant="outline"
                onClick={() => handleResolution(selectedDispute, 'escalate')}
                className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Escalate
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Resolution Modal */}
      <Modal
        isOpen={showResolutionModal}
        onClose={() => setShowResolutionModal(false)}
        title={`${resolutionAction === 'resolve' ? 'Resolve' : 'Escalate'} Dispute`}
        size="lg"
      >
        <div className="space-y-6">
          <div className={`rounded-lg p-4 ${resolutionAction === 'resolve' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              {resolutionAction === 'resolve' ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              )}
              <span className={`font-medium ${resolutionAction === 'resolve' ? 'text-emerald-800' : 'text-amber-800'}`}>
                {resolutionAction === 'resolve' ? 'Resolve Dispute' : 'Escalate Dispute'}
              </span>
            </div>
            <p className={`text-sm ${resolutionAction === 'resolve' ? 'text-emerald-700' : 'text-amber-700'}`}>
              {resolutionAction === 'resolve' 
                ? 'This will mark the dispute as resolved and notify all parties involved.'
                : 'This will escalate the dispute to a higher authority for further review.'
              }
            </p>
          </div>

          {selectedDispute && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Dispute Summary</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">ID:</span> {selectedDispute.id}</p>
                <p><span className="text-gray-600">Title:</span> {selectedDispute.title}</p>
                <p><span className="text-gray-600">Property:</span> {selectedDispute.landTitle}</p>
                <p><span className="text-gray-600">Value:</span> {formatCurrency(selectedDispute.estimatedValue)}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {resolutionAction === 'resolve' ? 'Resolution Notes' : 'Escalation Reason'}
            </label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder={resolutionAction === 'resolve' 
                ? 'Describe how the dispute was resolved...'
                : 'Explain why this dispute needs escalation...'
              }
              required
            />
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={confirmResolution}
              className={`flex-1 ${resolutionAction === 'escalate' ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
              disabled={!resolutionNotes.trim()}
            >
              {resolutionAction === 'resolve' ? 'Resolve Dispute' : 'Escalate Dispute'}
            </Button>
            <Button variant="outline" onClick={() => setShowResolutionModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}