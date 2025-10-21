import React, { useState, useEffect } from "react";
import { ArrowRightLeft, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
// import { formatCurrency } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import { getWeb3, getLandRegistryContract } from '../../lib/web3';

// Use Vite env variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function TransferOwnershipPage() {
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientUser, setRecipientUser] = useState<any>(null);
  const [recipientLoading, setRecipientLoading] = useState(false);
  const [transferPrice, setTransferPrice] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast ? useToast() : { showToast: () => {} };

  // Fetch real lands owned by the user from backend
  const [myLands, setMyLands] = useState<any[]>([]);
  const [landsLoading, setLandsLoading] = useState(false);
  const [landsError, setLandsError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLandsLoading(true);
      try {
        const api = await import('../../lib/api');
        const res = await api.apiFetch('/land/owner/my-lands');
        const data = await res.json();
        setMyLands(data?.data || []);
      } catch (err) {
        setLandsError('Failed to load your lands.');
      } finally {
        setLandsLoading(false);
      }
    };
    load();
  }, []);

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLand || !recipientAddress) return;
    setShowConfirmModal(true);
  };

  // For now, look up recipient by user ID (MongoDB _id)
  // When migrating to blockchain, switch to wallet address lookup
  const confirmTransfer = async () => {
    setShowConfirmModal(false);
    setIsTransferring(true);
    setError(null);


    try {
      // 1. Look up recipient user by wallet address
      const api = await import('../../lib/api');
      const userRes = await api.apiFetch(`/auth/user-by-wallet/${recipientAddress}`, { method: 'GET' });
      if (!userRes.ok) {
        setIsTransferring(false);
        setError('Recipient not found. Please check the wallet address.');
        showToast && showToast('Recipient not found. Please check the wallet address.', 'error');
        return;
      }
      const userData = await userRes.json();
      const recipientId = userData?.data?._id || userData?.data?.id;
      if (!recipientId) {
        setIsTransferring(false);
        setError('Recipient not found.');
        showToast && showToast('Recipient not found.', 'error');
        return;
      }

      // 1. Call smart contract transferLand from MetaMask
      const web3 = getWeb3();
      const contract = getLandRegistryContract(web3);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      if (!account) throw new Error('No wallet connected');

      // Ensure we have blockchain landId
      const blockchainLandId = selectedLand.landId;
      if (!blockchainLandId) throw new Error('This land is missing a blockchain landId.');

      // Call transferLand on-chain using blockchain landId
      const tx = await contract.methods
        .transferLand(Number(blockchainLandId), recipientAddress)
        .send({ from: account });

      // 2. Notify backend so DB updates ownership
      const transferRes = await api.apiFetch('/land/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landId: Number(blockchainLandId),
          newOwnerWallet: recipientAddress,
          transferPrice: transferPrice ? Number(transferPrice) : undefined,
          blockchainHash: tx.transactionHash,
        }),
      });
      const transferData = await transferRes.json();

      setTransactionHash(transferData?.data?.blockchainHash || tx.transactionHash || '');
      setIsTransferring(false);
      setShowSuccessModal(true);
      showToast && showToast('Land ownership transferred successfully!', 'success');
      // Reset form
      setSelectedLand(null);
      setRecipientAddress('');
      setTransferPrice('');
    } catch (err: any) {
      setIsTransferring(false);
      setError('An error occurred during transfer.');
      showToast && showToast('An error occurred during transfer.', 'error');
    }
  };

  // Validate Ethereum address
  const isValidWalletAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  // Fetch recipient user info by wallet address
  useEffect(() => {
    if (!recipientAddress || !isValidWalletAddress(recipientAddress)) {
      setRecipientUser(null);
      return;
    }
    setRecipientLoading(true);
    (async () => {
      try {
        const api = await import('../../lib/api');
        const res = await api.apiFetch(`/auth/user-by-wallet/${recipientAddress}`, { method: 'GET' });
        if (!res.ok) throw new Error('not found');
        const data = await res.json();
        setRecipientUser(data?.data || null);
      } catch (err) {
        setRecipientUser(null);
      } finally {
        setRecipientLoading(false);
      }
    })();
  }, [recipientAddress]);

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
                  <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                    {myLands.map((land) => {
                      // Support both .id and ._id for backend/legacy compatibility
                      const landId = land._id || land.id;
                      return (
                        <div
                          key={landId}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedLand && (selectedLand._id || selectedLand.id) === landId
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
                                <p className="text-xs text-gray-600">{land.price} ETH</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {myLands.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No transferable properties found</p>
                    </div>
                  )}
                </div>

                {/* Recipient Address */}
                {/*
                  For now, enter the recipient's MongoDB user ID. When migrating to blockchain, switch to wallet address input.
                  Uncomment wallet address validation and placeholder as needed.
                */}
                <Input
                  label="Recipient Wallet Address"
                  value={recipientAddress}
                  onChange={(e) => {
                    setRecipientAddress(e.target.value);
                    setError(null);
                  }}
                  placeholder="0x..."
                  required
                  error={recipientAddress && !isValidWalletAddress(recipientAddress) ? 'Invalid wallet address' : ''}
                  helperText="Enter the recipient's Ethereum wallet address."
                />
                {recipientLoading && (
                  <div className="text-blue-600 text-sm">Looking up recipient...</div>
                )}
                {recipientUser && (
                  <div className="text-green-700 text-sm">Recipient: <span className="font-semibold">{recipientUser.name || recipientUser.email || recipientUser.walletAddress}</span></div>
                )}
                {recipientAddress && isValidWalletAddress(recipientAddress) && !recipientLoading && !recipientUser && (
                  <div className="text-red-600 text-sm">Recipient not found.</div>
                )}

                {/* Transfer Price */}
                <Input
                  label="Transfer Price (ETH, Optional)"
                  type="number"
                  step="0.0001"
                  min="0"
                  value={transferPrice}
                  onChange={(e) => setTransferPrice(e.target.value)}
                  placeholder="0.00"
                  helperText="Enter the price in ETH. Leave empty for free transfer."
                />

                {/* Gas Fee Estimation */}
                {selectedLand && recipientUser && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Transaction Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Property:</span>
                        <span className="text-blue-900 font-medium">{selectedLand.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">To:</span>
                        <span className="text-blue-900 font-mono">{recipientUser.name || recipientUser.email || recipientUser._id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Recipient User ID:</span>
                        <span className="text-blue-900 font-mono">{recipientUser._id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Transfer Price:</span>
                        <span className="text-blue-900 font-medium">
                          {transferPrice ? `${transferPrice} ETH` : 'Free'}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-blue-200 pt-2">
                        <span className="text-blue-700">Estimated Gas Fee:</span>
                        <span className="text-blue-900 font-medium">Network fee (ETH)</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-red-600 text-sm text-center">{error}</div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedLand || !recipientAddress || !isValidWalletAddress(recipientAddress) || !recipientUser || isTransferring}
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

      {/* Loading and error states for lands */}
      {landsLoading && (
        <div className="text-center text-blue-600">Loading your lands...</div>
      )}
      {landsError && (
        <div className="text-center text-red-600">{landsError}</div>
      )}

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
                      {transferPrice ? `${transferPrice} ETH` : 'Free'}
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