import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Calendar, DollarSign, TrendingUp, AlertTriangle, FileText, Settings, BarChart3, Clock } from 'lucide-react';
import { PlatformStats } from '../../types';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';


const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const navigate = useNavigate();


  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/profile/all');
      const data = await res.json();
  
      const totalUsers = data.length;
      const totalClients = data.filter((user: any) => user.role === 'client').length;
      const totalLawyers = data.filter((user: any) => user.role === 'lawyer').length;
  
      const mockAppointments = 3456; // Replace with real API later
      const mockRevenue = 2847500;
      const mockMonthlyRevenue = 485600;
      const activeConsultations = 23;
      const pendingVerifications = data.filter((user: any) => user.role === 'lawyer' && user.verificationStatus === 'pending').length;
      const disputesCount = 3;
  
      const computedStats: PlatformStats = {
        totalUsers,
        totalClients,
        totalLawyers,
        totalAppointments: mockAppointments,
        totalRevenue: mockRevenue,
        monthlyRevenue: mockMonthlyRevenue,
        activeConsultations,
        pendingVerifications,
        disputesCount,
      };
  
      setStats(computedStats);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const recentActivities = [
    {
      id: '1',
      type: 'user_registration',
      message: 'New lawyer registration: Dr. Amit Sharma',
      timestamp: new Date(Date.now() - 300000),
      status: 'pending'
    },
    {
      id: '2',
      type: 'payment',
      message: 'Payment completed: ₹2,500 for consultation #1234',
      timestamp: new Date(Date.now() - 600000),
      status: 'completed'
    },
    {
      id: '3',
      type: 'dispute',
      message: 'New dispute raised for appointment #5678',
      timestamp: new Date(Date.now() - 900000),
      status: 'open'
    },
    {
      id: '4',
      type: 'verification',
      message: 'Lawyer verification completed: Advocate Priya Sharma',
      timestamp: new Date(Date.now() - 1200000),
      status: 'verified'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'dispute':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'verification':
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'open':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and management</p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">+12%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
            <p className="text-sm font-medium text-gray-600">Total Lawyers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalLawyers}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">+8%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
            <p className="text-sm font-medium text-gray-600">Verified Lawyers</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.verifiedLawyers ?? (stats.totalLawyers - stats.pendingVerifications)}
            </p>

            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-blue-600">Live now</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</p>
            </div>
            <UserCheck className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-yellow-600">Requires attention</span>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would be integrated here</p>
              <p className="text-sm text-gray-400 mt-1">Using Chart.js or similar library</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Revenue</span>
              <span className="font-semibold text-green-600">₹{(stats.monthlyRevenue / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Platform Commission</span>
              <span className="font-semibold">₹{(stats.monthlyRevenue * 0.1 / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lawyer Payouts</span>
              <span className="font-semibold">₹{(stats.monthlyRevenue * 0.9 / 1000).toFixed(0)}K</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average per Consultation</span>
                <span className="font-semibold">₹2,847</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-gray-700">Clients</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{stats.totalClients}</span>
                <span className="text-gray-500 ml-2">({((stats.totalClients / stats.totalUsers) * 100).toFixed(1)}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-700">Lawyers</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{stats.totalLawyers}</span>
                <span className="text-gray-500 ml-2">({((stats.totalLawyers / stats.totalUsers) * 100).toFixed(1)}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-blue-500 h-2 rounded-l-full" 
                style={{ width: `${(stats.totalClients / stats.totalUsers) * 100}%` }}
              ></div>
              <div 
                className="bg-green-500 h-2 rounded-r-full" 
                style={{ width: `${(stats.totalLawyers / stats.totalUsers) * 100}%`, marginTop: '-8px', marginLeft: `${(stats.totalClients / stats.totalUsers) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {activity.timestamp.toLocaleTimeString()}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
            onClick={() => navigate('/admin/verification')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserCheck className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Verify Lawyers</p>
              <p className="text-sm text-gray-500">{stats.pendingVerifications} pending</p>
            </div>
          </button>


          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Resolve Disputes</p>
              <p className="text-sm text-gray-500">{stats.disputesCount} open</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <DollarSign className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Process Payouts</p>
              <p className="text-sm text-gray-500">Weekly payouts</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="h-6 w-6 text-gray-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Platform Settings</p>
              <p className="text-sm text-gray-500">Configure system</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;