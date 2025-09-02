import React, { useState } from 'react';
import { Wallet, Lock, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLoginOptions = [
    { role: 'Landowner', email: 'john.landowner@example.com', description: 'Register and manage land parcels' },
    { role: 'Buyer', email: 'sarah.buyer@example.com', description: 'Search and purchase land' },
    // { role: 'Administrator', email: 'admin@landregistry.gov', description: 'Manage registrations and disputes' },
    // { role: 'Government Agent', email: 'agent@landregistry.gov', description: 'Audit and generate reports' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">LR</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your LandRegistry account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />
            
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={<Lock className="h-5 w-5 text-gray-400" />}
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" loading={isLoading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-blue-700 hover:text-blue-800 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-4">
              Demo: Use password "password" for any account
            </p>
          </div>
        </Card>

        {/* Quick Login Options */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Quick Demo Access</h2>
            <p className="text-gray-600">Try different user roles instantly</p>
          </div>

          <div className="space-y-4">
            {quickLoginOptions.map((option) => (
              <Card key={option.role} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <button
                  onClick={() => {
                    setEmail(option.email);
                    setPassword('password');
                  }}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{option.role}</h3>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      <p className="text-xs text-blue-600 mt-1">{option.email}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}