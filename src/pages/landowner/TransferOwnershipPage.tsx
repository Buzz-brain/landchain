import React, { useState } from 'react';
import { ArrowRightLeft, Wallet, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { mockLands } from '../../lib/mock-data';
import { formatCurrency, formatAddress, generateMockHash } from '../../lib/utils';

export function TransferOwnershipPage() {
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferPrice, setTransferPrice] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  const myLands = mockLands.filter(land => land.status === 'registered');

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLand || !recipientAddress) return;
    setShowConfirmModal(true);
  };

  const confirmTransfer = async () => {
    setShowConfirmModal(false);
    setIsTransferring(true);

    // Mock blockchain transaction
    setTimeout(() => {
      const hash = generateMockHash();
      setTransactionHash(hash);
      setIsTransferring(false);
      setShowSuccessModal(true);
      
      // Reset form
      setSelectedLand(null);
      setRecipientAddress('');
      setTransferPrice('');
    }, 3000);
  };

  const isValidAddress = (address: string) => {
    return address.startsWith('0x') && address.length === 42;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer Land Ownership</h1>
        <p className="text-lg text-gray-600">
          Securely transfer your land ownership to another wallet address via blockchain
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRightLeft className="h-5 w-5 mr-2" />
                Transfer Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransferSubmit} className="space-y-6">
                {/* Property Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Property to Transfer
                  </label>
                  <div className="grid gap-3">
                    {myLands.map((land) => (
                      <div
                        key={land.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedLand?.id === land.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedLand(land)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{land.title}</h4>
                            <p className="text-sm text-gray-600">{land.parcelId}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{land.location.address}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{land.size} {land.sizeUnit}</p>
                            {land.price && (
                              <p className="text-xs text-gray-600">{formatCurrency(land.price)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {myLands.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No transferable properties found</p>
                    </div>
                  )}
                </div>

                {/* Recipient Address */}
                <Input
                  label="Recipient Wallet Address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x742D35CC6131B3C0E5E2F2E3F8A9B2C4F5D6E7F8"
                  required
                  error={recipientAddress && !isValidAddress(recipientAddress) ? 'Invalid wallet address' : ''}
                  helperText="Enter the Ethereum wallet address of the new owner"
                />

                {/* Transfer Price */}
                <Input
                  label="Transfer Price (Optional)"
                  type="number"
                  step="0.01"
                  value={transferPrice}
                  onChange={(e) => setTransferPrice(e.target.value)}
                  placeholder="0.00"
                  helperText="Leave empty for free transfer"
                />

                {/* Gas Fee Estimation */}
                {selectedLand && recipientAddress && isValidAddress(recipientAddress) && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Transaction Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Property:</span>
                        <span className="text-blue-900 font-medium">{selectedLand.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">To:</span>
                        <span className="text-blue-900 font-mono">{formatAddress(recipientAddress)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Transfer Price:</span>
                        <span className="text-blue-900 font-medium">
                          {transferPrice ? formatCurrency(parseFloat(transferPrice)) : 'Free'}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-blue-200 pt-2">
                        <span className="text-blue-700">Estimated Gas Fee:</span>
                        <span className="text-blue-900 font-medium">~$12.50</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedLand || !recipientAddress || !isValidAddress(recipientAddress)}
                  loading={isTransferring}
                >
                  {isTransferring ? 'Processing Transfer...' : 'Initiate Transfer'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Transfer Guide */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Select Property</h4>
                  <p className="text-sm text-gray-600">Choose the land you want to transfer</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Enter Recipient</h4>
                  <p className="text-sm text-gray-600">Provide the buyer's wallet address</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Confirm Transfer</h4>
                  <p className="text-sm text-gray-600">Review and confirm the transaction</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-emerald-600">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Blockchain Update</h4>
                  <p className="text-sm text-gray-600">Ownership is updated on the blockchain</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-amber-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-gray-700">
                • Transfers are irreversible once confirmed on the blockchain
              </p>
              <p className="text-gray-700">
                • Ensure the recipient address is correct before confirming
              </p>
              <p className="text-gray-700">
                • Gas fees are required for blockchain transactions
              </p>
              <p className="text-gray-700">
                • The recipient will become the new legal owner
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Ownership Transfer"
      >
        <div className="space-y-6">
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="font-medium text-amber-800">Important Warning</span>
            </div>
            <p className="text-sm text-amber-700">
              This action is irreversible. Once confirmed, the ownership of this property will be 
              permanently transferred to the specified wallet address.
            </p>
          </div>

          {selectedLand && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Transfer Summary</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property:</span>
                    <span className="font-medium">{selectedLand.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parcel ID:</span>
                    <span className="font-medium">{selectedLand.parcelId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To Address:</span>
                    <span className="font-mono text-xs">{recipientAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transfer Price:</span>
                    <span className="font-medium">
                      {transferPrice ? formatCurrency(parseFloat(transferPrice)) : 'Free'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button onClick={confirmTransfer} className="flex-1">
              Confirm Transfer
            </Button>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Transfer Successful!"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ownership Transfer Complete
            </h3>
            <p className="text-gray-600 mb-4">
              The property has been successfully transferred to the new owner.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Transaction Hash:</p>
              <p className="text-xs font-mono break-all text-gray-800">
                {transactionHash}
              </p>
            </div>
          </div>
          <Button onClick={() => setShowSuccessModal(false)} className="w-full">
            Continue
          </Button>
        </div>
      </Modal>
    </div>
  );
}