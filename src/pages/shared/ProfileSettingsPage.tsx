import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Wallet, Shield, Bell, Save, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
// import { formatAddress } from '../../lib/utils';

export function ProfileSettingsPage() {
  const { user, connectWallet, isWalletConnected } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  // const [notifications, setNotifications] = useState({
  //   emailTransactions: true,
  //   emailDisputes: true,
  //   emailMarketing: false,
  //   pushTransactions: true,
  //   pushDisputes: true,
  // });

  const handleSave = () => {
    // Mock save functionality
    setIsEditing(false);
    // In real app, would make API call to update user profile
  };

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-lg text-gray-600 mt-2">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button> */}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="+1 (555) 123-4567"
                /> */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="info" className="capitalize">
                      {user?.role?.replace('-', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-500">Cannot be changed</span>
                  </div>
                </div>
              </div>

              {/* <Input
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                placeholder="123 Main St, City, State, ZIP"
              /> */}

              {isEditing && (
                <div className="flex space-x-4 pt-4">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Settings */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                  />
                  <Input
                    label="Confirm New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span>{showPassword ? 'Hide' : 'Show'} passwords</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card> */}

          {/* Notification Settings */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Email Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={notifications.emailTransactions}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          emailTransactions: e.target.checked
                        })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Transaction updates</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={notifications.emailDisputes}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          emailDisputes: e.target.checked
                        })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Dispute notifications</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={notifications.emailMarketing}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          emailMarketing: e.target.checked
                        })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Marketing emails</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Push Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={notifications.pushTransactions}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          pushTransactions: e.target.checked
                        })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Transaction updates</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={notifications.pushDisputes}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          pushDisputes: e.target.checked
                        })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Dispute notifications</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Wallet Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Wallet Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.walletAddress ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isWalletConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium">
                      {isWalletConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Wallet Address:</p>
                    <p className="font-mono text-sm text-gray-800 break-all">
                      {user.walletAddress}
                    </p>
                  </div>
                  {!isWalletConnected && (
                    <Button size="sm" onClick={handleConnectWallet} className="w-full">
                      Reconnect Wallet
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">No wallet connected</p>
                  <Button size="sm" onClick={handleConnectWallet} className="w-full">
                    Connect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Summary */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since:</span>
                  <span className="font-medium">Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account status:</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verification:</span>
                  <Badge variant="success">Verified</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Two-factor auth:</span>
                  <Badge variant="warning">Disabled</Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="w-full">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card> */}

          {/* Quick Actions */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Change Email
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Verify Phone
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                Update Address
              </Button>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}