import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Eye, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
// import { mockLands } from "../../lib/mock-data"; // remove soon
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../lib/utils';
import { getWeb3, getLandRegistryContract } from '../../lib/web3';

export function MyLandsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [myLands, setMyLands] = useState<any[]>([]);
  const [loadingLands, setLoadingLands] = useState(false);
  const [landsError, setLandsError] = useState<string | null>(null);
  const [listPrice, setListPrice] = useState('');
  const [listingLand, setListingLand] = useState<any>(null);
  const [isListing, setIsListing] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "landowner") {
      const fetchStats = async () => {
        setLoadingStats(true);
        try {
          const apiBase = import.meta.env.VITE_API_BASE_URL || "";
          const res = await fetch(`${apiBase}/land/owner/stats`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok && data.data) {
            setStats(data.data);
          } else {
            setStats(null);
          }
        } catch (err) {
          setStats(null);
        } finally {
          setLoadingStats(false);
        }
      };
      fetchStats();

      // Fetch lands
      const fetchLands = async () => {
        setLoadingLands(true);
        setLandsError(null);
        try {
          const apiBase = import.meta.env.VITE_API_BASE_URL || "";
          const res = await fetch(`${apiBase}/land/owner/my-lands`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok && Array.isArray(data.data)) {
            setMyLands(data.data);
          } else {
            setMyLands([]);
            setLandsError("No lands found.");
          }
        } catch (err) {
          setMyLands([]);
          setLandsError("Failed to load lands.");
        } finally {
          setLoadingLands(false);
        }
      };
      fetchLands();
    }
  }, [user]);

  const viewLandDetails = (land: any) => {
    setSelectedLand(land);
    setShowDetailsModal(true);
  };

  const openListModal = (land: any) => {
    setListingLand(land);
    setListPrice('');
    setListError(null);
    setShowListModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "success";
      case "pending":
        return "warning";
      case "transferred":
        return "info";
      case "disputed":
        return "error";
      default:
        return "default";
    }
  };

  // Fetch lands function (hoisted for reuse)
  const fetchLands = async () => {
    setLoadingLands(true);
    setLandsError(null);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${apiBase}/land/owner/my-lands`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setMyLands(data.data);
      } else {
        setMyLands([]);
        setLandsError("No lands found.");
      }
    } catch (err) {
      setMyLands([]);
      setLandsError("Failed to load lands.");
    } finally {
      setLoadingLands(false);
    }
  };

  const handleListForSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingLand || !listPrice) return;
    setIsListing(true);
    setListError(null);
    try {
      const web3 = getWeb3();
      const contract = getLandRegistryContract(web3);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      if (!account) throw new Error('No wallet connected');
      // Convert price to Wei
      const priceWei = web3.utils.toWei(listPrice, 'ether');
      // Only use the numeric landId for contract call
      if (!listingLand.landId) throw new Error('This land is missing a blockchain landId.');
      const tx = await contract.methods.listForSale(listingLand.landId, priceWei).send({ from: account });
      // Notify backend so DB updates isForSale and price
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "";
        await fetch(`${apiBase}/land/list-for-sale`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ landId: listingLand.landId, price: Number(listPrice), blockchainHash: tx.transactionHash })
        });
      } catch (notifyErr) {
        // Non-fatal: backend update failed, but on-chain listing succeeded
        console.error('Failed to notify backend of listing', notifyErr);
      }

      setShowListModal(false);
      setListingLand(null);
      setListPrice('');
      // Refetch lands to update UI
      fetchLands();
    } catch (err: any) {
      setListError(err?.message || 'Failed to list land for sale.');
    } finally {
      setIsListing(false);
    }
  };

  // Auto-refresh lands after registration until all have landId
  useEffect(() => {
    if (!loadingLands && myLands.some(l => l.status === 'registered' && !l.landId)) {
      const interval = setInterval(() => {
        fetchLands();
      }, 3000); // poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [myLands, loadingLands]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Land Portfolio
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage your registered land properties and ownership records
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {user?.role === "landowner" && stats ? stats.totalLands : 0}
          </p>
          <p className="text-sm text-gray-600">Total Properties</p>
        </div>
      </div>

      {/* Summary Cards */}
      {loadingStats ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-gray-500 text-lg">Loading stats...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.role === "landowner" && stats
                      ? `${stats.totalValue} ETH`
                      : `0 ETH`}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">For Sale</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.role === "landowner" && stats
                      ? stats.landsForSale
                      : 0}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Area</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.role === "landowner" && stats
                      ? stats.totalArea?.toFixed(1)
                      : "0.0"}
                  </p>
                  <p className="text-xs text-gray-500">acres</p>
                </div>
                <MapPin className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Verified</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.role === "landowner" && stats
                      ? stats.verifiedLands
                      : 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Land List */}
      {loadingLands ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-gray-500 text-lg">Loading lands...</span>
        </div>
      ) : landsError ? (
        <div className="text-center py-12 text-red-500">{landsError}</div>
      ) : (
        <div className="grid gap-6">
          {myLands.map((land) => (
            <Card key={land._id || land.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {land.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Parcel ID: {land.parcelId}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(land.status) as any}>
                        {land.status}
                      </Badge>
                    </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{land.location.address}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Size</p>
                      <p className="font-medium">
                        {land.size} {land.sizeUnit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Registered</p>
                      <p className="font-medium">
                        {formatDate(land.registrationDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Value</p>
                      <p className="font-medium">
                        {land.price ? `${land.price} ETH` : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            land.isForSale ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                        />
                        <span className="font-medium">
                          {land.isForSale ? "For Sale" : "Not Listed"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewLandDetails(land)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {/* List for Sale button: only show if not already for sale */}
                  {!land.isForSale && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openListModal(land)}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      List for Sale
                    </Button>
                  )}
                  {/* ...existing Edit/Delete buttons if needed... */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {myLands.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No land properties found
            </h3>
            <p className="text-gray-600 mb-4">
              Start by registering your first land property
            </p>
            <Button onClick={() => navigate('/register-land')}>Register New Land</Button>
          </CardContent>
        </Card>
      )}

      {/* Land Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedLand?.title || "Land Details"}
        size="xl"
      >
        {selectedLand && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Property Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parcel ID:</span>
                      <span className="font-medium">
                        {selectedLand.parcelId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">
                        {selectedLand.size} {selectedLand.sizeUnit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium">
                        {selectedLand.price
                          ? `${selectedLand.price} ETH`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registered:</span>
                      <span className="font-medium">
                        {formatDate(selectedLand.registrationDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <p className="text-sm text-gray-600">
                    {selectedLand.location.address}
                  </p>
                  {selectedLand.location.coordinates.lat && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedLand.location.coordinates.lat},{" "}
                      {selectedLand.location.coordinates.lng}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
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
                      {selectedLand.blockchainHash}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Documents
                  </h4>
                  <div className="space-y-2">
                    {selectedLand.documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{doc.name}</span>
                        <Badge variant="info" className="text-xs">
                          IPFS
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Transfer Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Transfer Ownership"
        size="lg"
      >
        {selectedLand && (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Property to Transfer
              </h4>
              <p className="text-blue-800">{selectedLand.title}</p>
              <p className="text-sm text-blue-700">
                Parcel ID: {selectedLand.parcelId}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Wallet Address
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Price (ETH, Optional)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount in ETH"
                />
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> This action will transfer ownership
                of the property to the specified wallet address. This
                transaction is irreversible once confirmed on the blockchain.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button className="flex-1">Initiate Transfer</Button>
              <Button
                variant="outline"
                onClick={() => setShowTransferModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* List for Sale Modal */}
      <Modal
        isOpen={showListModal}
        onClose={() => setShowListModal(false)}
        title="List Land for Sale"
        size="md"
      >
        <form onSubmit={handleListForSale} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (ETH)</label>
            <input
              type="number"
              min="0"
              step="0.0001"
              className="w-full border rounded px-3 py-2"
              value={listPrice}
              onChange={e => setListPrice(e.target.value)}
              required
              placeholder="Enter price in ETH"
              disabled={isListing}
            />
          </div>
          {listError && <div className="text-red-500 text-sm">{listError}</div>}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setShowListModal(false)} disabled={isListing}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isListing || !listPrice}>
              {isListing ? 'Listing...' : 'List for Sale'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}