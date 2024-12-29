import { useState, useEffect } from 'react';
import api from '../utils/api';
import EpisodeProgress from '../components/MovieEpisodeProgress';
import { Select, RatingStars, SearchInput,StatusBadge } from '../components/MovieRating';
import {
  Film,
  Tv2,
  List,
  Plus,
  LayoutGrid,
  LayoutList,
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

const MovieTvCard = ({ item, onStatusUpdate, onProgressUpdate, onRatingUpdate, statusOptions, viewStyle, onDelete }) => {
  const cardClass = viewStyle === 'grid'
    ? "bg-gray-800 rounded-xl shadow-lg hover:shadow-red-900/30 transition-all duration-300 overflow-hidden border border-red-900 hover:border-red-700 group relative"
    : "bg-gray-800 rounded-xl shadow-lg hover:shadow-red-900/30 transition-all duration-300 overflow-hidden border border-red-900 hover:border-red-700 group flex relative";

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
          <h3 className="text-sm font-semibold mb-1 line-clamp-2 text-transparent bg-gradient-to-r bg-clip-text from-red-300 to-red-200 ">
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

        <div className="space-y-2">
          <span className="text-xs text-gray-400">Rating</span>
          <RatingStars
            rating={item.userRating || 0}
            onRatingChange={(newRating) => onRatingUpdate(item._id, newRating)}
          />
        </div>
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


const MediaTVList = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewStyle, setViewStyle] = useState('grid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    mediaType: '',
    search: '',
    page: 1,
    limit: 500
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
    { value: 'tv', label: 'TV Shows' }
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
      fetchMediaList();
    }
  };

  const handleRatingUpdate = async (id, newRating) => {
    try {
      // Optimistically update UI
      setMediaList(prevList =>
        prevList.map(item =>
          item._id === id ? { ...item, userRating: newRating } : item
        )
      );

      // Update in database
      await api.put(`/media/list/${id}`, { userRating: newRating });
    } catch (error) {
      console.error('Error updating rating:', error);
      fetchMediaList();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header and Filters */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-300 text-transparent bg-clip-text">
              MOVIE-SERIES コレクション
            </h1>
            <p className="text-gray-400 mt-1">
              {totalItems} soul in your collection
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewStyle('grid')}
                className={`p-2 rounded-md transition-colors ${viewStyle === 'grid'
                    ? 'bg-gray-800 shadow-lg shadow-red-900/20'
                    : 'text-gray-400 hover:text-red-400'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewStyle('list')}
                className={`p-2 rounded-md transition-colors ${viewStyle === 'list'
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
              to="/search/movie"
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
        <div className={`grid gap-6 ${viewStyle === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
          }`}>
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : mediaList.length > 0 ? (
        <div className={`grid gap-6 ${viewStyle === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
          }`}>
          {mediaList.map((item) => (
            <MovieTvCard
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
          <h3 className="text-lg font-medium text-gray-400">No media found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or search term
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaTVList;