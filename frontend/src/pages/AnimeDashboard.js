// AnimeDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Skull, Clock, Star } from 'lucide-react';
import api from '../utils/api';

const AnimeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnimeDashboardData = async () => {
    try {
      const [statsResponse, recentResponse] = await Promise.all([
        api.get('/anime/stats'),
        api.get('/anime/list?limit=9&sort=updatedAt&order=desc')
      ]);
      setStats(statsResponse.data);
      setRecentItems(recentResponse.data.items);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const userSatisfactionLevel  = (rating) => {
  switch (rating) {
    case 10:
      return " Absolute Cinema 🎬🔥 Masterpiece👑 !";
    case 9:
      return " Boss Level Stuff 😤✨ Mood ban gaya!";
    case 8:
      return " Mast Anime Hai 🔥 Worth every second!";
    case 7:
      return " Acha hai, but thoda aur spice hota toh maza aa jata 🌶️😌";
    case 6:
      return " Dekha ja sakta hai 😎 Not bad, not great.";
    case 5:
      return " Dekhne layak hai... bas phone side mein mat rakhna 😐📱";
    case 4:
      return " Kuch jadda he bekar ha ye toh 🤷‍♂️ ";
    case 3:
      return " Mujhe toh neend aa gayi be 😪 Zzz...";
    case 2:
      return " Ek kaam karo, delete kardo, Ek number bakwaass 🐌🧾";
    case 1:
      return " Biggest piece of shit 🚮🤡 Kaun banata hai ye sab?!";
    default:
      return "Bhai rating 1-10 ke beech mein de 🤨📊";
  }
};



  useEffect(() => {
    fetchAnimeDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-red-500 rounded-full animate-spin-slow opacity-30"></div>
          <div className="w-12 h-12 border-4 border-red-600 rounded-full animate-spin-reverse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
          <div className="w-8 h-8 border-4 border-red-700 rounded-full animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"></div>
          <div className="w-2 h-2 bg-red-800 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    );
  }

  const COLORS = ['#FF4444', '#FF8C00', '#FFD700', '#4A90E2', '#50C878'];
  const STATUS_COLORS = {
    planning: '#FFD700',
    watching: '#4A90E2',
    completed: '#50C878',
    on_hold: '#FF8C00',
    dropped: '#FF4444'
  };

  const statusData = (stats && stats.byStatus) ? Object.entries(stats.byStatus).map(([status, count]) => ({
    name: status.replace('_', ' ').toUpperCase(),
    value: count
  })) : [];

  const typeData = (stats && stats.byMediaType) ? Object.entries(stats.byMediaType).map(([type, count]) => ({
    name: type.toUpperCase(),
    value: count
  })) : [];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gray-900 rounded-lg shadow-lg border border-red-800 p-6">
        <h1 className="text-2xl font-bold mb-4 text-red-400">Anime Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-red-700">
            <div className="flex items-center space-x-2">
              <Flame className="text-red-500" size={24} />
              <h3 className="text-lg font-semibold text-red-400">Total Anime</h3>
            </div>
            <p className="text-3xl font-bold text-gray-200">{stats?.totalItems || 0}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-red-700">
            <div className="flex items-center space-x-2">
              <Skull className="text-green-400" size={24} />
              <h3 className="text-lg font-semibold text-green-400">Completed</h3>
            </div>
            <p className="text-3xl font-bold text-gray-200">{stats?.completedCount || 0}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-red-700">
            <div className="flex items-center space-x-2">
              <Clock className="text-yellow-400" size={24} />
              <h3 className="text-lg font-semibold text-yellow-400">Watching</h3>
            </div>
            <p className="text-3xl font-bold text-gray-200">{stats?.byStatus?.watching || 0}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-red-700">
            <div className="flex items-center space-x-2">
              <Star className="text-purple-400" size={24} />
              <h3 className="text-lg font-semibold text-purple-400">Average Rating</h3>
            </div>
            <p className="text-3xl font-bold text-gray-200">{stats?.avgRating || 0}/10</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      </div>

      {/* Recent Activity Section */}
      <div className="bg-gray-900 rounded-lg shadow-lg border border-red-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-400">Recent Activity</h2>
          <Link to="/list/movie" className="text-red-400 hover:text-red-300 transition-colors duration-200">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentItems.map((item) => (
            <div key={item._id} className="bg-gray-800 border border-red-700 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-28 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-24 bg-gray-700 rounded flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-200 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 capitalize">{item.type}</p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs rounded-full" style={{
                      backgroundColor: STATUS_COLORS[item.status] + '20',
                      color: STATUS_COLORS[item.status]
                    }}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {item.progress?.totalEpisodes && (
                    <p className="text-sm text-gray-400 mt-1">
                      Episode {item.progress.currentEpisode}/{item.progress.totalEpisodes}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">
                      Rating {item.rating || '🫠'}/10 - {userSatisfactionLevel(item.rating)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimeDashboard;
