import React, { useState } from 'react';
import { Users, Search, Filter, MoreHorizontal, UserCheck, UserX, Eye, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { mockUsers } from '../../lib/mock-data';
import { formatDate } from '../../lib/utils';

export function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'activate' | 'deactivate'>('activate');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extended mock users with additional data
  const extendedUsers = [
    ...mockUsers.map(user => ({
      ...user,
      status: 'active',
      lastLogin: '2024-01-26T10:30:00Z',
      registrationDate: user.createdAt,
      totalTransactions: Math.floor(Math.random() * 50) + 1,
      phone: '+1 (555) 123-4567',
      address: '123 Main St, Springfield, IL 62701',
      verificationStatus: 'verified',
    })),
    {
      id: '5',
      email: 'inactive.user@example.com',
      role: 'buyer',
      name: 'Inactive User',
      createdAt: '2024-01-05T08:00:00Z',
      status: 'inactive',
      lastLogin: '2024-01-10T15:20:00Z',
      registrationDate: '2024-01-05T08:00:00Z',
      totalTransactions: 0,
      phone: '+1 (555) 987-6543',
      address: '456 Oak Ave, Springfield, IL 62702',
      verificationStatus: 'pending',
    },
  ];

  const filteredUsers = extendedUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const viewUserDetails = (user: any) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleUserAction = (user: any, action: 'activate' | 'deactivate') => {
    setSelectedUser(user);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmUserAction = () => {
    // Mock user action
    console.log(`${actionType}ing user:`, selectedUser?.id);
    setShowActionModal(false);
    setSelectedUser(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'suspended': return 'warning';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'landowner': return 'info';
      case 'buyer': return 'default';
      case 'administrator': return 'error';
      case 'government-agent': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage user accounts, roles, and access permissions
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{extendedUsers.length}</p>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {extendedUsers.filter(u => u.status === 'active').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Landowners</p>
                <p className="text-2xl font-bold text-blue-600">
                  {extendedUsers.filter(u => u.role === 'landowner').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Buyers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {extendedUsers.filter(u => u.role === 'buyer').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inactive</p>
                <p className="text-2xl font-bold text-red-600">
                  {extendedUsers.filter(u => u.status === 'inactive').length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
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
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="landowner">Landowner</option>
                <option value="buyer">Buyer</option>
                <option value="administrator">Administrator</option>
                <option value="government-agent">Government Agent</option>
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Transactions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getRoleColor(user.role) as any} className="capitalize">
                        {user.role.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusColor(user.status) as any} className="capitalize">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{formatDate(user.lastLogin)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(user.lastLogin).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{user.totalTransactions}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewUserDetails(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {user.status === 'active' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction(user, 'deactivate')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction(user, 'activate')}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedUser?.name || 'User Details'}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedUser.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium">{selectedUser.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Account Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-medium">{selectedUser.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <Badge variant={getRoleColor(selectedUser.role) as any} className="capitalize">
                        {selectedUser.role.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={getStatusColor(selectedUser.status) as any} className="capitalize">
                        {selectedUser.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verification:</span>
                      <Badge variant={selectedUser.verificationStatus === 'verified' ? 'success' : 'warning'}>
                        {selectedUser.verificationStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Activity Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration Date:</span>
                      <span className="font-medium">{formatDate(selectedUser.registrationDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Login:</span>
                      <span className="font-medium">{formatDate(selectedUser.lastLogin)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Transactions:</span>
                      <span className="font-medium">{selectedUser.totalTransactions}</span>
                    </div>
                  </div>
                </div>

                {selectedUser.walletAddress && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Wallet Information</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Wallet Address:</p>
                      <p className="font-mono text-sm text-gray-800 break-all">
                        {selectedUser.walletAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-gray-200">
              <Button variant="outline" className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Contact User
              </Button>
              {selectedUser.status === 'active' ? (
                <Button
                  variant="outline"
                  onClick={() => handleUserAction(selectedUser, 'deactivate')}
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Deactivate
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => handleUserAction(selectedUser, 'activate')}
                  className="flex-1"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Activate
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={`${actionType === 'activate' ? 'Activate' : 'Deactivate'} User`}
      >
        <div className="space-y-6">
          <div className={`rounded-lg p-4 ${actionType === 'activate' ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              {actionType === 'activate' ? (
                <UserCheck className="h-5 w-5 text-emerald-600" />
              ) : (
                <UserX className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${actionType === 'activate' ? 'text-emerald-800' : 'text-red-800'}`}>
                {actionType === 'activate' ? 'Activate User Account' : 'Deactivate User Account'}
              </span>
            </div>
            <p className={`text-sm ${actionType === 'activate' ? 'text-emerald-700' : 'text-red-700'}`}>
              {actionType === 'activate' 
                ? 'This will restore the user\'s access to the platform and all associated features.'
                : 'This will revoke the user\'s access to the platform. They will not be able to log in or perform any actions.'
              }
            </p>
          </div>

          {selectedUser && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">User Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Name:</span> {selectedUser.name}</p>
                <p><span className="text-gray-600">Email:</span> {selectedUser.email}</p>
                <p><span className="text-gray-600">Role:</span> {selectedUser.role.replace('-', ' ')}</p>
                <p><span className="text-gray-600">Current Status:</span> {selectedUser.status}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={confirmUserAction}
              className={`flex-1 ${actionType === 'deactivate' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
              {actionType === 'activate' ? 'Activate User' : 'Deactivate User'}
            </Button>
            <Button variant="outline" onClick={() => setShowActionModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}