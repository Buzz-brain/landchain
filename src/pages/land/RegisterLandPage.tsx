import React, { useState } from 'react';
import { Upload, MapPin, FileText, Link, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { generateMockHash } from '../../lib/utils';

export function RegisterLandPage() {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    size: '',
    sizeUnit: 'acres' as 'acres' | 'hectares' | 'sqft',
    coordinates: { lat: '', lng: '' },
    description: '',
  });
  const [documents, setDocuments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [blockchainHash, setBlockchainHash] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock blockchain deployment
    setTimeout(() => {
      const hash = generateMockHash();
      setBlockchainHash(hash);
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 3000);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocs = files.map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name: file.name,
      type: file.name.toLowerCase().includes('deed') ? 'deed' : 'other',
      file,
      ipfsHash: `Qm${Math.random().toString(36).substring(2, 44)}`, // Mock IPFS hash
    }));
    setDocuments([...documents, ...newDocs]);
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Register New Land
        </h1>
        <p className="text-lg text-gray-600">
          Add your land to the blockchain registry with secure, immutable
          records
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Land Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="e.g., Oakwood Estate Plot A"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Size Unit
                  </label>
                  <select
                    value={formData.sizeUnit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sizeUnit: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="sqft">Square Feet</option>
                  </select>
                </div>
              </div>

              <Input
                label="Property Size"
                type="text"
                step="0.1"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                required
                placeholder="e.g., 5 by 2 or 100 by 200"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Additional details about the property..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Property Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
                placeholder="123 Oak Street, Springfield, IL 62701"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Latitude"
                  value={formData.coordinates.lat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordinates: {
                        ...formData.coordinates,
                        lat: e.target.value,
                      },
                    })
                  }
                  placeholder="39.7817"
                  helperText="GPS coordinates (optional)"
                />
                <Input
                  label="Longitude"
                  value={formData.coordinates.lng}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordinates: {
                        ...formData.coordinates,
                        lng: e.target.value,
                      },
                    })
                  }
                  placeholder="-89.6501"
                  helperText="GPS coordinates (optional)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Supporting Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Documents
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload property deeds, surveys, certificates, and other
                  supporting documents
                </p>
                <label className="cursor-pointer">
                  <Button variant="outline" type="button">
                    <Plus className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {documents.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Uploaded Documents
                  </h4>
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {doc.name}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Link className="h-3 w-3" />
                            <span>
                              IPFS: {doc.ipfsHash.substring(0, 10)}...
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                        type="button"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Blockchain Deployment */}
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Deploy to Blockchain
              </h3>
              <p className="text-gray-600 mb-6">
                This will create an immutable record of your land ownership on
                the blockchain
              </p>
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                disabled={
                  !formData.title || !formData.address || !formData.size
                }
              >
                {isSubmitting
                  ? "Deploying to Blockchain..."
                  : "Register Land on Blockchain"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Land Registration Successful!"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your land has been successfully registered!
            </h3>
            <p className="text-gray-600 mb-4">
              The property "{formData.title}" is now secured on the blockchain
              with an immutable record.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Blockchain Hash:</p>
              <p className="text-xs font-mono break-all text-gray-800">
                {blockchainHash}
              </p>
            </div>
          </div>
          <Button onClick={() => setShowSuccessModal(false)} className="w-full">
            Continue to Dashboard
          </Button>
        </div>
      </Modal>
    </div>
  );
}