import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, Loader2, Plus, Star, Info } from 'lucide-react';
import {toast} from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from '../utils/api';

const SearchMedia = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialSearch, setInitialSearch] = useState(false);

  // Reference for the intersection observer
  const observer = useRef();
  // Reference for the last element
  const lastElementRef = useCallback((node) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && initialSearch) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, initialSearch]);

  const searchMedia = async (pageNumber, isNewSearch = false) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/media/search?query=${encodeURIComponent(searchQuery)}&page=${pageNumber}`);
      
      const newResults = response.data.results;
      setHasMore(response.data.page < response.data.total_pages);
      
      if (isNewSearch) {
        setSearchResults(newResults);
      } else {
        setSearchResults(prev => [...prev, ...newResults]);
      }
      
      setInitialSearch(true);
    } catch (err) {
      toast.error('Failed to search media', {
        duration: 3000,
        position: 'top-center',
      });
      setError('Failed to search media');
    } finally {
      setLoading(false);
    }
  };

  // Handle initial search
  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    setHasMore(true);
    await searchMedia(1, true);
  };

  // Effect to handle pagination
  useEffect(() => {
    if (page > 1) {
      searchMedia(page, false);
    }
  }, [page]);

  const handleAddToList = async (media) => {
    const loadingToast = toast.loading('Adding to list...', {
      position: 'top-center'
    });

    try {
      await api.post('/media/list', {
        tmdbId: media.id,
        mediaType: media.media_type,
        status: 'planning'
      });
      
      toast.dismiss(loadingToast);
      toast.success(`Added "${media.title || media.name}" to your list!`, {
        duration: 3000,
        position: 'top-center',
      });
      
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Failed to add to list', {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const handleShowDetails = (media) => {
    setSelectedMedia(media);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-800">
            Discover Movies & Shows
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Search through millions of movies, TV shows, and anime. Add them to your watchlist and never miss out on great entertainment.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies, TV shows, or anime..."
              className="w-full pl-12 pr-4 py-6"
            />
            <Button
              type="submit"
              disabled={loading && page === 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600"
            >
              {loading && page === 1 ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Searching...</span>
                </>
              ) : (
                <span>Search</span>
              )}
            </Button>
          </div>
        </form>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map((media, index) => (
            <div 
              key={`${media.id}-${index}`}
              ref={index === searchResults.length - 1 ? lastElementRef : null}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-slate-100 flex flex-col"
            >
              {media.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                  alt={media.title || media.name}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-64 bg-slate-100 flex items-center justify-center">
                  <Star className="h-12 w-12 text-slate-300" />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1">
                  {media.title || media.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">
                  {media.overview}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
                    {media.media_type}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowDetails(media)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddToList(media)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading More Indicator */}
        {loading && page > 1 && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
          </div>
        )}

        {/* Empty State */}
        {searchResults.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-600">
              {searchQuery ? 'No results found. Try a different search.' : 'Start searching to discover great content!'}
            </p>
          </div>
        )}

        {/* Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedMedia?.title || selectedMedia?.name}</DialogTitle>
              <DialogDescription>
                Released: {selectedMedia?.release_date || selectedMedia?.first_air_date}
              </DialogDescription>
            </DialogHeader>
            {selectedMedia && (
              <div className="space-y-4">
                <img
                  src={`https://image.tmdb.org/t/p/w500${selectedMedia.poster_path}`}
                  alt={selectedMedia.title || selectedMedia.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-sm text-slate-600">{selectedMedia.overview}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <span className="text-sm text-slate-600">
                    {selectedMedia.vote_average?.toFixed(1)} / 10
                  </span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SearchMedia;