import { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import {
  Search,
  Film,
  Tv2,
  List,
  ChevronDown,
  Plus,
  Minus,
  Star,
  LayoutGrid,
  LayoutList,
  X,
  Plus as PlusIcon,
  Trash2,
  AlertTriangle
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
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-red-400">
      <Icon className="h-4 w-4" />
    </div>
    <select
      value={value}
      onChange={onChange}
      className="appearance-none w-full pl-10 pr-10 py-2 bg-gray-800 border border-red-800 rounded-lg text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value} className="bg-gray-800">
          {label}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-red-400">
      <ChevronDown className="h-4 w-4" />
    </div>
  </div>
);

const SearchInput = ({ value, onChange, onClear }) => (
  <div className="relative flex-1 min-w-[240px]">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-red-400">
      <Search className="h-4 w-4" />
    </div>
    <input
      type="text"
      placeholder="Search titles..."
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-red-800 rounded-lg text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-gray-500"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-red-400"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);


const EpisodeProgress = ({ current, total, onUpdate }) => {
  const [localCount, setLocalCount] = useState(current);

  useEffect(() => {
    setLocalCount(current);
  }, [current]);

  const handleUpdate = (newCount) => {
    const validCount = Math.max(0, Math.min(newCount, total));
    setLocalCount(validCount);
    onUpdate(validCount);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">Episodes</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleUpdate(localCount - 1)}
            className="p-1 rounded-full hover:bg-red-100 disabled:opacity-0 disabled:cursor-not-allowed"
            disabled={localCount <= 0}
          >
            <Minus className="w-4 h-4 text-gray-500" />
          </button>
          
          <span className="text-sm text-gray-400 font-medium min-w-[60px] text-center">
            {localCount} / {total}
          </span>
          
          <button
            onClick={() => handleUpdate(localCount + 1)}
            className="p-1 rounded-full hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={localCount >= total}
          >
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      <DraggableProgressBar 
        current={localCount} 
        total={total} 
        onUpdate={handleUpdate} 
      />
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    planning: 'bg-blue-900/50 text-blue-200 border-blue-800',
    in_progress: 'bg-yellow-900/100 text-yellow-200 border-yellow-800',
    completed: 'bg-green-900/100 text-green-200 border-green-800',
    on_hold: 'bg-orange-900/100 text-orange-200 border-orange-800',
    dropped: 'bg-red-900/100 text-red-200 border-red-800'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};


const DraggableProgressBar = ({ current, total, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(current);
  const progressRef = useRef(null);

  useEffect(() => {
    setLocalValue(current);
  }, [current]);

  const calculateProgress = (clientX) => {
    const rect = progressRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.min(Math.max(x / width, 0), 1);
    return Math.round(percentage * total);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const newValue = calculateProgress(e.clientX);
    setLocalValue(newValue);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newValue = calculateProgress(e.clientX);
      setLocalValue(newValue);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onUpdate(localValue);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onUpdate(localValue);
      }
    };

    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        const newValue = calculateProgress(e.clientX);
        setLocalValue(newValue);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, localValue, onUpdate, total]);

  return (
    <div className="space-y-2">
      <div 
        ref={progressRef}
        className="relative w-full bg-gray-700 rounded-full h-2 cursor-pointer group"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="absolute bg-red-600 h-full rounded-full transition-all duration-100"
          style={{ width: `${(localValue / total) * 100}%` }}
        />
        
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-gray-800 border-2 border-red-600 rounded-full transition-all
            ${isDragging ? 'scale-125' : 'scale-100 group-hover:scale-110'}
            cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
          style={{ left: `${(localValue / total) * 100}%` }}
        />

        <div className="absolute inset-0 rounded-full bg-red-500/10 opacity-0 group-hover:opacity-30 pointer-events-none" />
      </div>

      <div className="flex justify-between text-sm text-gray-400">
        <span>Episode {localValue}</span>
        <span>Total {total}</span>
      </div>
    </div>
  );
};

const RatingStars = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[...Array(10)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-red-500 fill-red-500' 
            : 'text-gray-700'
        }`}
      />
    ))}
    <span className="ml-2 text-sm text-gray-400">{rating}/10</span>
  </div>
);

const MediaCard = ({ item, onStatusUpdate, onProgressUpdate, statusOptions, viewStyle, onDelete }) => {
  const cardClass = viewStyle === 'grid'
    ? "bg-gray-800 rounded-xl shadow-lg hover:shadow-red-900/30 transition-all duration-300 overflow-hidden border border-red-900 hover:border-red-700 group relative"
    : "bg-gray-800 rounded-xl shadow-lg hover:shadow-red-900/30 transition-all duration-300 overflow-hidden border border-red-900 hover:border-red-700 group flex relative";

  const imageClass = viewStyle === 'grid'
    ? "relative aspect-[4/3] overflow-hidden"
    : "relative w-48 overflow-hidden";

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
        {item.posterPath ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Film className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <StatusBadge status={item.status} />
        </div>
      </div>
      
      <div className={contentClass}>
        <div>
          <h3 className="text-lg font-semibold mb-1 line-clamp-2 text-transparent bg-gradient-to-r bg-clip-text from-red-300 to-red-200 ">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {item.mediaType === 'movie' ? (
              <Film className="w-4 h-4" />
            ) : (
              <Tv2 className="w-4 h-4" />
            )}
            {item.mediaType.toUpperCase()}
            {item.releaseDate && (
              <span>• {new Date(item.releaseDate).getFullYear()}</span>
            )}
          </div>
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

        {item.mediaType !== 'movie' && (
          <EpisodeProgress
            current={item.progress?.currentEpisode || 0}
            total={item.progress?.totalEpisodes || 0}
            onUpdate={(newCount) => onProgressUpdate(item._id, newCount)}
          />
        )}

        {item.userRating && (
          <RatingStars rating={item.userRating} />
        )}
      </div>
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-red-900">
    <div className="aspect-[2/3] bg-gray-700 animate-pulse" />
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


// Main Media List Component
const MediaList = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewStyle, setViewStyle] = useState('grid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    mediaType: '',
    search: '',
    page: 1
  });
  const [totalItems, setTotalItems] = useState(0);

  const fetchMediaList = async () => {
    try {
      const params = new URLSearchParams({
        ...filters,
        sort: 'updatedAt', 
        order: 'desc'
      });
      const response = await api.get(`/media/list?${params}`);
      setMediaList(response.data.items);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Error fetching media list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      fetchMediaList();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleDelete = async (id) => {
    try {
      // Optimistically update UI
      setMediaList(prevList => prevList.filter(item => item._id !== id));
      setTotalItems(prev => prev - 1);

      // Delete from server
      await api.delete(`/media/list/${id}`);
    } catch (error) {
      console.error('Error deleting item:', error);
      // Revert on error
      fetchMediaList();
    }
  };

  const handleDeleteAll = async () => {
    try {
      // Delete all items from server
      await api.delete('/media/list');
      // Update UI
      setMediaList([]);
      setTotalItems(0);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting all items:', error);
      fetchMediaList();
    }
  };


  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Optimistically update the UI
      setMediaList(prevList =>
        prevList.map(item =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );

      await api.put(`/media/list/${id}`, { status: newStatus });
      // Only fetch if needed to sync with server
      // fetchMediaList();
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert on error
      fetchMediaList();
    }
  };

  const statusOptions = [
    'planning',
    'in_progress',
    'completed',
    'on_hold',
    'dropped'
  ];

  const mediaTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Shows' },
    { value: 'anime', label: 'Anime' }
  ];

  const clearSearch = () => setFilters({ ...filters, search: '' });

  const handleProgressUpdate = async (id, newCount) => {
    try {
     
      const currentItem = mediaList.find(item => item._id === id);
      if (!currentItem) return;

      const totalEpisodes = currentItem.progress?.totalEpisodes || 0;
      const validatedCount = Math.max(0, Math.min(newCount, totalEpisodes));

      setMediaList(prevList =>
        prevList.map(item =>
          item._id === id
            ? {
                ...item,
                progress: {
                  ...item.progress,
                  currentEpisode: validatedCount
                },
                // Update status to completed if all episodes are watched
                status: validatedCount === totalEpisodes && totalEpisodes > 0 
                  ? 'completed' 
                  : item.status
              }
            : item
        )
      );
      await api.put(`/media/list/${id}/progress`, {
        currentEpisode: validatedCount,
        totalEpisodes: totalEpisodes
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      // Revert on error
      fetchMediaList();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header and Filters */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-300 text-transparent bg-clip-text font-['Fira_Sans']">
              デビル コレクション
            </h1>
            <p className="text-gray-400 mt-1">
              {totalItems} あなたのコレクションの中の魂
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewStyle('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewStyle === 'grid'
                    ? 'bg-gray-800 shadow-lg shadow-red-900/20'
                    : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewStyle('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewStyle === 'list'
                    ? 'bg-gray-800 shadow-lg shadow-red-900/20'
                    : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>

            {mediaList.length > 0 && (
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors border border-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Delete All
              </button>
            )}

            <NavLink 
              to="/search" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors border border-red-600"
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
          
          <Select
            icon={Film}
            value={filters.mediaType}
            onChange={(e) => setFilters({ ...filters, mediaType: e.target.value })}
            options={mediaTypeOptions}
          />
          
          <SearchInput
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onClear={clearSearch}
          />
        </div>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-2 border-red-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete All Items
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete all items from your collection? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border border-red-800">
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

      {/* Media List Grid */}
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
      ) : mediaList.length > 0 ? (
        <div className={`grid gap-6 ${
          viewStyle === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {mediaList.map((item) => (
            <MediaCard
              key={item._id}
              item={item}
              onStatusUpdate={handleStatusUpdate}
              onProgressUpdate={handleProgressUpdate}
              onDelete={handleDelete}
              statusOptions={statusOptions}
              viewStyle={viewStyle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <List className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No media found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or search term
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaList;