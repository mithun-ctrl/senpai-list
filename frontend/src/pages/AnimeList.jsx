import { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import {
  Search,
  List,
  ChevronDown,
  Plus,
  Minus,
  Star,
  LayoutGrid,
  LayoutList,
  X,
  Trash2,
  AlertTriangle,
  Play
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NavLink } from 'react-router-dom';

const Select = ({ icon: Icon, value, onChange, options }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-purple-400">
      <Icon className="h-4 w-4" />
    </div>
    <select
      value={value}
      onChange={onChange}
      className="appearance-none w-full pl-10 pr-10 py-2 text-xs bg-gray-800 border border-purple-800 rounded text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value} className="bg-gray-800">
          {label}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-purple-400">
      <ChevronDown className="h-4 w-4" />
    </div>
  </div>
);

const SearchInput = ({ value, onChange, onClear }) => (
  <div className="relative flex-1 min-w-[240px]">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-purple-400">
      <Search className="h-4 w-4" />
    </div>
    <input
      type="text"
      placeholder="Search your anime list..."
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-purple-800 rounded-lg text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-500"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-purple-400"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);

const EpisodeProgress = ({ current, total, onUpdate }) => {
  const [localCount, setLocalCount] = useState(current || 0);

  useEffect(() => {
    setLocalCount(current || 0);
  }, [current]);

  const handleUpdate = (newCount) => {
    const validCount = Math.max(0, Math.min(newCount, total || Infinity));
    setLocalCount(validCount);
    onUpdate(validCount);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Episodes</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleUpdate(localCount - 1)}
            className="p-1 rounded-full hover:bg-purple-100/10 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={localCount <= 0}
          >
            <Minus className="w-4 h-4 text-gray-400" />
          </button>
          
          <span className="text-xs text-gray-400 font-medium min-w-[60px] text-center">
            {localCount} / {total || '?'}
          </span>
          
          <button
            onClick={() => handleUpdate(localCount + 1)}
            className="p-1 rounded-full hover:bg-purple-100/10 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={total && localCount >= total}
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-purple-600 h-full rounded-full transition-all"
          style={{ width: `${total ? (localCount / total) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
};


const StatusBadge = ({ status }) => {
  const colors = {
    watching: 'bg-blue-900/50 text-blue-200 border-blue-800',
    completed: 'bg-green-900/50 text-green-200 border-green-800',
    planing: 'bg-purple-900/50 text-purple-200 border-purple-800',
    on_hold: 'bg-orange-900/50 text-orange-200 border-orange-800',
    dropped: 'bg-red-900/50 text-red-200 border-red-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};

const RatingStars = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);
  return(
    <div className="flex items-center gap-1">
    {[...Array(10)].map((_, i) => (
      <button
        key={i}
        onClick={() => onRatingChange(i + 1)}
        onMouseEnter={() => setHover(i + 1)}
        onMouseLeave={() => setHover(0)}
        className="focus:outline-none transform transition-transform hover:scale-110"
      >
        <Star
          className={`w-4 h-4 transition-colors duration-200 ${
            i < (hover || rating) 
              ? 'text-purple-500 fill-purple-500' 
              : 'text-purple-700'
          }`}
        />
      </button>
    ))}
    <span  className="ml-2 text-sm text-purple-400">
      {rating > 0 ? `${rating}/10` : '0/10'}
    </span>
  </div>
  )
}

const AnimeCard = ({ item, onStatusUpdate, onProgressUpdate, onRatingUpdate, statusOptions, viewStyle, onDelete }) => {
  const cardClass = viewStyle === 'grid'
    ? "bg-gray-800 rounded-xl shadow-lg hover:shadow-purple-900/30 transition-all duration-300 overflow-hidden border border-purple-900 hover:border-purple-700 group relative"
    : "bg-gray-800 rounded-xl shadow-lg hover:shadow-purple-900/30 transition-all duration-300 overflow-hidden border border-purple-900 hover:border-purple-700 group flex relative";

  const imageClass = viewStyle === 'grid'
    ? "relative aspect-[3/2] overflow-hidden"
    : "relative w-32 overflow-hidden";

  const contentClass = viewStyle === 'grid'
    ? "p-4 space-y-4"
    : "p-4 space-y-4 flex-1";

  return (
    <div className={cardClass}>
      <button
        onClick={() => onDelete(item._id)}
        className="absolute top-2 right-2 p-2 bg-red-900/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-800 z-10"
        title="Delete"
      >
        <Trash2 className="w-4 h-4 text-red-300" />
      </button>

      <div className={imageClass}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <Play className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <StatusBadge status={item.status} />
        </div>
      </div>
      
      <div className={contentClass}>
        <div>
          <p className="text-sm font-semibold mb-1 line-clamp-2 text-transparent bg-gradient-to-r bg-clip-text from-purple-300 to-purple-200">
            {item.title}
          </p>
          {item.type && (
            <div className="text-sm text-gray-500">
              {item.type.toUpperCase()}
            </div>
          )}
        </div>

        <Select
          icon={List}
          value={item.status}
          onChange={(e) => onStatusUpdate(item._id, e.target.value)}
          options={statusOptions.map(status => ({
            value: status,
            label: status.replace('_', ' ').toUpperCase()
          }))}
        />

        <EpisodeProgress
          current={item.progress?.currentEpisode || 0}
          total={item.progress?.totalEpisodes}
          onUpdate={(newCount) => onProgressUpdate(item._id, newCount)}
        />

        <RatingStars
          rating={item.rating || 0}
          onRatingChange={(rating) => onRatingUpdate(item._id, rating)}
        />
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-purple-900">
    <div className="aspect-[3/4] bg-gray-700 animate-pulse" />
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <div className="h-6 bg-gray-700 rounded animate-pulse" />
        <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse" />
      </div>
      <div className="h-10 bg-gray-700 rounded animate-pulse" />
      <div className="h-4 bg-gray-700 rounded animate-pulse" />
      <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
    </div>
  </div>
);

const AnimeList = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewStyle, setViewStyle] = useState('grid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    limit: 500
  });
  const [totalItems, setTotalItems] = useState(0);

  const fetchAnimeList = async () => {
    try {
      const params = new URLSearchParams({
        ...filters,
        sort: 'updatedAt',
        order: 'desc'
      });
      const response = await api.get(`/anime/list?${params}`);
      setAnimeList(response.data.items);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Error fetching anime list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      fetchAnimeList();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleDelete = async (id) => {
    try {
      setAnimeList(prevList => prevList.filter(item => item._id !== id));
      setTotalItems(prev => prev - 1);
      await api.delete(`/anime/list/${id}`);
    } catch (error) {
      console.error('Error deleting item:', error);
      fetchAnimeList();
    }
  };

  const handleDeleteAll = async () => {
    try {
      await api.delete('/anime/list');
      setAnimeList([]);
      setTotalItems(0);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting all items:', error);
      fetchAnimeList();
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setAnimeList(prevList =>
        prevList.map(item =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
      await api.put(`/anime/list/${id}`, { status: newStatus }); 
    } catch (error) {
      console.error('Error updating status:', error);
      fetchAnimeList();
    }
  };

  const handleRatingUpdate = async (id, rating) => {
    try {
      setAnimeList(prevList =>
        prevList.map(item =>
          item._id === id ? { ...item, rating } : item
        )
      );
      await api.put(`/anime/list/${id}`, { rating });
    } catch (error) {
      console.error('Error updating rating:', error);
      fetchAnimeList();
    }
  };

  const statusOptions = [
    'watching',
    'completed',
    'planing',
    'on_hold',
    'dropped'
  ];

  const handleProgressUpdate = async (id, newCount) => {
    try {
        const currentItem = animeList.find(item => item._id === id);
        if (!currentItem) return;

        const totalEpisodes = currentItem.progress?.totalEpisodes || null;
        const validatedCount = Math.max(0, Math.min(newCount, totalEpisodes || Infinity));

        // Update local state
        setAnimeList(prevList =>
            prevList.map(item =>
                item._id === id
                    ? {
                        ...item,
                        progress: {
                            currentEpisode: validatedCount,
                            totalEpisodes: item.progress?.totalEpisodes
                        },
                        status: totalEpisodes && validatedCount === totalEpisodes 
                            ? 'completed' 
                            : validatedCount > 0
                            ? 'watching'
                            : item.status
                    }
                    : item
            )
        );

        // Make API call to update the database
        const response = await api.put(`/anime/list/${id}`, {
            progress: {
                currentEpisode: validatedCount,
                totalEpisodes: currentItem.progress?.totalEpisodes
            }
        });

        // Update local state with server response to ensure consistency
        setAnimeList(prevList =>
            prevList.map(item =>
                item._id === id ? { ...item, ...response.data } : item
            )
        );
    } catch (error) {
        console.error('Error updating progress:', error);
        // Revert back to server state on error
        fetchAnimeList();
    }
};

  const clearSearch = () => setFilters({ ...filters, search: '' });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 text-transparent bg-clip-text">
            Anime コレクション
            </h1>
            <p className="text-gray-400 mt-1">
              {totalItems} soul in your collection
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewStyle('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewStyle === 'grid'
                    ? 'bg-gray-800 shadow-lg shadow-purple-900/20'
                    : 'text-gray-400 hover:text-purple-400'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewStyle('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewStyle === 'list'
                    ? 'bg-gray-800 shadow-lg shadow-purple-900/20'
                    : 'text-gray-400 hover:text-purple-400'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>

            {animeList.length > 0 && (
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-colors border border-purple-600"
              >
                <Trash2 className="w-4 h-4" />
                Delete All
              </button>
            )}

            <NavLink 
              to="/search/anime" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-colors border border-purple-600"
            >
              <Plus className="w-4 h-4" />
              Add New
            </NavLink>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full">
          <Select
            icon={List}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: '', label: 'All Status' },
              ...statusOptions.map(status => ({
                value: status,
                label: status.replace('_', ' ').toUpperCase()
              }))
            ]}
          />
          
          <SearchInput
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onClear={clearSearch}
          />
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-2 border-purple-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete All Anime
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete all anime from your list? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border border-purple-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="bg-red-800 text-white hover:bg-red-700 border border-red-600"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loading ? (
        <div className={`grid gap-6 ${
          viewStyle === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : animeList.length > 0 ? (
        <div className={`grid gap-6 ${
          viewStyle === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {animeList.map((item) => (
            <AnimeCard
              key={item._id}
              item={item}
              onStatusUpdate={handleStatusUpdate}
              onProgressUpdate={handleProgressUpdate}
              onRatingUpdate={handleRatingUpdate}
              onDelete={handleDelete}
              statusOptions={statusOptions}
              viewStyle={viewStyle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <List className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-200">No anime found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or add some anime to your list
          </p>
        </div>
      )}
    </div>
  );
};

export default AnimeList;