import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Download, Calendar, Filter, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';

export function ReportsAnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalTransactions: 1234,
      totalValue: 45600000,
      activeUsers: 248,
      landRegistrations: 150,
      transactionGrowth: 12.5,
      valueGrowth: 8.3,
      userGrowth: 15.2,
      registrationGrowth: 22.1,
    },
    transactions: {
      daily: [
        { date: '2024-01-20', count: 15, value: 2500000 },
        { date: '2024-01-21', count: 22, value: 3200000 },
        { date: '2024-01-22', count: 18, value: 2800000 },
        { date: '2024-01-23', count: 25, value: 4100000 },
        { date: '2024-01-24', count: 20, value: 3500000 },
        { date: '2024-01-25', count: 28, value: 4800000 },
        { date: '2024-01-26', count: 32, value: 5200000 },
      ],
      byType: [
        { type: 'Registration', count: 45, percentage: 36.5 },
        { type: 'Transfer', count: 38, percentage: 30.9 },
        { type: 'Verification', count: 25, percentage: 20.3 },
        { type: 'Dispute', count: 15, percentage: 12.2 },
      ],
    },
    ownership: {
      bySize: [
        { range: '0-1 acres', count: 45, percentage: 30 },
        { range: '1-5 acres', count: 78, percentage: 52 },
        { range: '5-10 acres', count: 20, percentage: 13.3 },
        { range: '10+ acres', count: 7, percentage: 4.7 },
      ],
      byLocation: [
        { location: 'Urban', count: 89, percentage: 59.3 },
        { location: 'Suburban', count: 34, percentage: 22.7 },
        { location: 'Rural', count: 27, percentage: 18 },
      ],
      byValue: [
        { range: '$0-100k', count: 35, percentage: 23.3 },
        { range: '$100k-250k', count: 58, percentage: 38.7 },
        { range: '$250k-500k', count: 42, percentage: 28 },
        { range: '$500k+', count: 15, percentage: 10 },
      ],
    },
    fraud: [
      {
        id: 'FA-001',
        type: 'Duplicate Registration',
        severity: 'high',
        description: 'Same property registered multiple times with different owners',
        detectedAt: '2024-01-25T14:30:00Z',
        status: 'investigating',
        affectedProperties: 2,
      },
      {
        id: 'FA-002',
        type: 'Suspicious Transaction',
        severity: 'medium',
        description: 'Rapid ownership transfers between related accounts',
        detectedAt: '2024-01-24T09:15:00Z',
        status: 'resolved',
        affectedProperties: 1,
      },
    ],
  };

  const exportReport = (reportType: string) => {
    // Mock export functionality
    console.log(`Exporting ${reportType} report...`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'investigating': return 'warning';
      case 'resolved': return 'success';
      case 'escalated': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-lg text-gray-600 mt-2">
            Comprehensive insights into platform performance and security
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'overview', label: 'Overview', icon: BarChart3 },
          { key: 'transactions', label: 'Transactions', icon: TrendingUp },
          { key: 'ownership', label: 'Ownership', icon: PieChart },
          { key: 'fraud', label: 'Fraud Alerts', icon: AlertTriangle },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedReport(tab.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedReport === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Report */}
      {selectedReport === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.overview.totalTransactions.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                      <span className="text-sm text-emerald-600">
                        +{analyticsData.overview.transactionGrowth}%
                      </span>
                    </div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(analyticsData.overview.totalValue)}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                      <span className="text-sm text-emerald-600">
                        +{analyticsData.overview.valueGrowth}%
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">$</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.overview.activeUsers}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                      <span className="text-sm text-emerald-600">
                        +{analyticsData.overview.userGrowth}%
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">👥</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Land Registrations</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.overview.landRegistrations}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                      <span className="text-sm text-emerald-600">
                        +{analyticsData.overview.registrationGrowth}%
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 font-bold">🏡</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.transactions.daily.map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{day.count}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{formatDate(day.date)}</p>
                        <p className="text-sm text-gray-600">{day.count} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(day.value)}</p>
                      <p className="text-sm text-gray-600">Total value</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transactions Report */}
      {selectedReport === 'transactions' && (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.transactions.daily.map((day) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{formatDate(day.date)}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(day.count / 35) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{day.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.transactions.byType.map((type) => (
                    <div key={type.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">{type.type}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">{type.percentage}%</span>
                        <span className="text-sm font-medium text-gray-900">{type.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Ownership Report */}
      {selectedReport === 'ownership' && (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Distribution by Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.ownership.bySize.map((size) => (
                    <div key={size.range} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{size.range}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full" 
                            style={{ width: `${size.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{size.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.ownership.byLocation.map((location) => (
                    <div key={location.location} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{location.location}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${location.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{location.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution by Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.ownership.byValue.map((value) => (
                    <div key={value.range} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{value.range}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-amber-600 h-2 rounded-full" 
                            style={{ width: `${value.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{value.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Fraud Alerts Report */}
      {selectedReport === 'fraud' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.fraud.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">High Severity</p>
                    <p className="text-2xl font-bold text-red-600">
                      {analyticsData.fraud.filter(f => f.severity === 'high').length}
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
                    <p className="text-sm text-gray-600 mb-1">Resolved</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {analyticsData.fraud.filter(f => f.status === 'resolved').length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fraud Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.fraud.map((alert) => (
                  <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{alert.type}</h4>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Alert ID: {alert.id}</span>
                            <span>Detected: {formatDate(alert.detectedAt)}</span>
                            <span>Properties: {alert.affectedProperties}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={getSeverityColor(alert.severity) as any}>
                          {alert.severity}
                        </Badge>
                        <Badge variant={getStatusColor(alert.status) as any}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => exportReport('transactions')}>
              <Download className="h-4 w-4 mr-2" />
              Transaction Report
            </Button>
            <Button variant="outline" onClick={() => exportReport('ownership')}>
              <Download className="h-4 w-4 mr-2" />
              Ownership Report
            </Button>
            <Button variant="outline" onClick={() => exportReport('fraud')}>
              <Download className="h-4 w-4 mr-2" />
              Fraud Report
            </Button>
            <Button variant="outline" onClick={() => exportReport('complete')}>
              <Download className="h-4 w-4 mr-2" />
              Complete Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}