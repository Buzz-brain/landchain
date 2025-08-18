import React, { useState } from 'react';
import { Shield, Search, Filter, Download, Calendar, User, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { formatDate, formatAddress } from '../../lib/utils';

export function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Mock audit log data
  const auditLogs = [
    {
      id: 'AL-001',
      timestamp: '2024-01-26T14:30:00Z',
      user: {
        id: '3',
        name: 'Michael Admin',
        email: 'admin@landregistry.gov',
        role: 'administrator',
      },
      action: 'approve_registration',
      resource: 'Land Registration',
      resourceId: 'LND-2024-004',
      details: 'Approved land registration for Mountain View Estate',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'info',
      category: 'registration',
    },
    {
      id: 'AL-002',
      timestamp: '2024-01-26T13:15:00Z',
      user: {
        id: '3',
        name: 'Michael Admin',
        email: 'admin@landregistry.gov',
        role: 'administrator',
      },
      action: 'deactivate_user',
      resource: 'User Account',
      resourceId: 'USER-005',
      details: 'Deactivated user account for policy violation',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'warning',
      category: 'user_management',
    },
    {
      id: 'AL-003',
      timestamp: '2024-01-26T11:45:00Z',
      user: {
        id: '4',
        name: 'Emma Wilson',
        email: 'agent@landregistry.gov',
        role: 'government-agent',
      },
      action: 'generate_report',
      resource: 'Analytics Report',
      resourceId: 'RPT-2024-001',
      details: 'Generated ownership distribution report for Q1 2024',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'info',
      category: 'reporting',
    },
    {
      id: 'AL-004',
      timestamp: '2024-01-26T10:20:00Z',
      user: {
        id: '3',
        name: 'Michael Admin',
        email: 'admin@landregistry.gov',
        role: 'administrator',
      },
      action: 'resolve_dispute',
      resource: 'Dispute',
      resourceId: 'DIS-001',
      details: 'Resolved ownership verification dispute in favor of original owner',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'info',
      category: 'dispute',
    },
    {
      id: 'AL-005',
      timestamp: '2024-01-25T16:30:00Z',
      user: {
        id: '3',
        name: 'Michael Admin',
        email: 'admin@landregistry.gov',
        role: 'administrator',
      },
      action: 'system_backup',
      resource: 'System',
      resourceId: 'SYS-BACKUP-001',
      details: 'Initiated system-wide data backup',
      ipAddress: '192.168.1.100',
      userAgent: 'System Process',
      severity: 'info',
      category: 'system',
    },
    {
      id: 'AL-006',
      timestamp: '2024-01-25T14:15:00Z',
      user: {
        id: '3',
        name: 'Michael Admin',
        email: 'admin@landregistry.gov',
        role: 'administrator',
      },
      action: 'failed_login_attempt',
      resource: 'Authentication',
      resourceId: 'AUTH-FAIL-001',
      details: 'Multiple failed login attempts detected from suspicious IP',
      ipAddress: '203.0.113.42',
      userAgent: 'Unknown',
      severity: 'warning',
      category: 'security',
    },
    {
      id: 'AL-007',
      timestamp: '2024-01-25T12:00:00Z',
      user: {
        id: '4',
        name: 'Emma Wilson',
        email: 'agent@landregistry.gov',
        role: 'government-agent',
      },
      action: 'export_data',
      resource: 'Transaction Data',
      resourceId: 'EXP-2024-001',
      details: 'Exported transaction history for regulatory compliance audit',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'info',
      category: 'data_export',
    },
    {
      id: 'AL-008',
      timestamp: '2024-01-25T09:30:00Z',
      user: {
        id: '3',
        name: 'Michael Admin',
        email: 'admin@landregistry.gov',
        role: 'administrator',
      },
      action: 'update_permissions',
      resource: 'User Permissions',
      resourceId: 'USER-003',
      details: 'Updated user permissions for enhanced security access',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'warning',
      category: 'permissions',
    },
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.resourceId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.category === filterAction;
    const matchesUser = filterUser === 'all' || log.user.id === filterUser;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getActionIcon = (category: string) => {
    switch (category) {
      case 'registration': return '📝';
      case 'user_management': return '👤';
      case 'dispute': return '⚖️';
      case 'reporting': return '📊';
      case 'security': return '🔒';
      case 'system': return '⚙️';
      case 'data_export': return '📤';
      case 'permissions': return '🔑';
      default: return '📋';
    }
  };

  const exportLogs = () => {
    // Mock export functionality
    const csvContent = filteredLogs.map(log => 
      `${log.id},${log.timestamp},${log.user.name},${log.action},${log.resource},${log.resourceId},${log.severity}`
    ).join('\n');
    
    const blob = new Blob([`ID,Timestamp,User,Action,Resource,Resource ID,Severity\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-logs.csv';
    a.click();
  };

  const uniqueUsers = Array.from(new Set(auditLogs.map(log => log.user.id)))
    .map(id => auditLogs.find(log => log.user.id === id)?.user)
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-lg text-gray-600 mt-2">
            Complete record of all administrative actions and system events
          </p>
        </div>
        <Button onClick={exportLogs} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Events</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {auditLogs.filter(log => 
                    new Date(log.timestamp).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Warning Events</p>
                <p className="text-2xl font-bold text-amber-600">
                  {auditLogs.filter(log => log.severity === 'warning').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-amber-600 font-bold">⚠</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Admins</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueUsers.length}</p>
              </div>
              <User className="h-8 w-8 text-gray-600" />
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
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Actions</option>
                <option value="registration">Registration</option>
                <option value="user_management">User Management</option>
                <option value="dispute">Dispute</option>
                <option value="reporting">Reporting</option>
                <option value="security">Security</option>
                <option value="system">System</option>
                <option value="data_export">Data Export</option>
                <option value="permissions">Permissions</option>
              </select>
            </div>

            <div>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                {uniqueUsers.map((user) => (
                  <option key={user?.id} value={user?.id}>
                    {user?.name}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Events ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Event</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Resource</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Severity</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getActionIcon(log.category)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{log.id}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">{log.details}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{log.user.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{log.user.role.replace('-', ' ')}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-700 capitalize">
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{log.resource}</p>
                        <p className="text-sm text-gray-600">{log.resourceId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{formatDate(log.timestamp)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getSeverityColor(log.severity) as any}>
                        {log.severity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedLogs.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No audit logs found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} events
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
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (page > totalPages) return null;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
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

      {/* Log Details */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{getActionIcon(log.category)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{log.user.name}</h4>
                    <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>IP: {formatAddress(log.ipAddress)}</span>
                    <span>Resource: {log.resourceId}</span>
                    <Badge variant={getSeverityColor(log.severity) as any} className="text-xs">
                      {log.severity}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}