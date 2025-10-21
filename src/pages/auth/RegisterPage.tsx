import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { getWeb3 } from '../../lib/web3';

export function RegisterPage({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {

  type FormDataType = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'landowner' | 'buyer';
    walletAddress: string;
  };

  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'landowner',
    walletAddress: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  // Note: Registration page should only fetch and display the wallet address from the provider.
  // The header Connect Wallet enforces validation against the logged-in user's registered wallet.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!formData.walletAddress) {
      setError('You must connect your MetaMask wallet to register.');
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const api = await import('../../lib/api');
      const res = await api.apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
          walletAddress: formData.walletAddress,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setSuccess('Account created successfully! You can now sign in.');
      setTimeout(() => {
        setSuccess('');
        onSwitchToLogin();
      }, 1500);
    } catch (err) {
      setError('Failed to create account. Please try again.');
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setError('');
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        setError('MetaMask is not available in this browser.');
        return;
      }
      const ethereum = (window as any).ethereum;
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const addr = accounts && accounts[0] ? accounts[0] : '';
      if (addr) {
        try {
          const web3 = getWeb3();
          const checksum = web3.utils.toChecksumAddress(addr);
          setFormData((prev) => ({ ...prev, walletAddress: checksum }));
        } catch (e) {
          setFormData((prev) => ({ ...prev, walletAddress: addr }));
        }
      }
    } catch (err) {
      setError('Failed to read wallet address from MetaMask.');
    }
  };

  // Registration page intentionally avoids preflight wallet validation here.

  const roleOptions = [
    { value: 'landowner', label: 'Landowner', description: 'Register and manage land parcels' },
    { value: 'buyer', label: 'Buyer', description: 'Search and purchase land' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">LR</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600">Join the LandRegistry platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.walletAddress}
                disabled
                className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-mono text-xs"
                placeholder="Connect MetaMask to autofill"
              />
              <Button type="button" onClick={handleConnect} disabled={!!formData.walletAddress} size="sm">
                {formData.walletAddress ? 'Connected' : 'Connect Wallet'}
              </Button>
            </div>
            {error && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs text-center">{error}</div>
            )}
          </div>

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

          <Input type="email" label="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <div className="space-y-2">
              {roleOptions.map((option) => (
                <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="role" value={option.value} checked={formData.role === option.value} onChange={(e) => setFormData({ ...formData, role: e.target.value as any })} className="mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Input type="password" label="Password (Must not be less than 8 characters)" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />

          <Input type="password" label="Confirm Password (Must not be less than 8 characters)" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" loading={isLoading} className="w-full">Create Account</Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Already have an account? <button onClick={onSwitchToLogin} className="text-blue-700 hover:text-blue-800 font-medium">Sign in</button></p>
        </div>
      </Card>
    </div>
  );
}