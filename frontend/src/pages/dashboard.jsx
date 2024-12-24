// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, recentResponse] = await Promise.all([
        api.get('/media/stats'),
        api.get('/media/list?limit=5&sort=updatedAt&order=desc')
      ]);
      setStats(statsResponse.data);
      setRecentItems(recentResponse.data.items);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

 if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          {/* Outer circle */}
          <div className="w-16 h-16 border-4 border-blue-500 rounded-full animate-spin-slow opacity-30"></div>
          {/* Middle circle */}
          <div className="w-12 h-12 border-4 border-purple-500 rounded-full animate-spin-reverse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
          {/* Inner circle */}
          <div className="w-8 h-8 border-4 border-pink-500 rounded-full animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"></div>
          {/* Center dot */}
          <div className="w-2 h-2 bg-indigo-600 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    );
  }

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const STATUS_COLORS = {
    planning: '#FFBB28',
    in_progress: '#0088FE',
    completed: '#00C49F',
    on_hold: '#FF8042',
    dropped: '#FF0000'
  };

  // Prepare data for status pie chart
  const statusData = stats ? Object.entries(stats.byStatus).map(([status, count]) => ({
    name: status.replace('_', ' ').toUpperCase(),
    value: count
  })) : [];

  // Prepare data for media type pie chart
  const typeData = stats ? Object.entries(stats.byMediaType).map(([type, count]) => ({
    name: type.toUpperCase(),
    value: count
  })) : [];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Total Items</h3>
            <p className="text-3xl font-bold text-blue-900">{stats?.totalItems || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700">Completed</h3>
            <p className="text-3xl font-bold text-green-900">{stats?.completedCount || 0}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-700">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-900">{stats?.byStatus?.in_progress || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-700">Average Rating</h3>
            <p className="text-3xl font-bold text-purple-900">{stats?.avgRating || 0}/10</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Media Type Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Media Type Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Link to="/list" className="text-blue-600 hover:text-blue-800">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentItems.map((item) => (
            <div key={item._id} className="border rounded-lg p-4">
              <div className="flex items-start space-x-4">
                {item.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${item.posterPath}`}
                    alt={item.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center">
                    No Image
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">{item.mediaType}</p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs rounded-full" style={{
                      backgroundColor: STATUS_COLORS[item.status] + '20',
                      color: STATUS_COLORS[item.status]
                    }}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {item.progress?.totalEpisodes && (
                    <p className="text-sm text-gray-600 mt-1">
                      Episode {item.progress.currentEpisode}/{item.progress.totalEpisodes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;