import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, Loader2, Plus, Star, Info, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
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
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialSearch, setInitialSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Handle click outside suggestions
  const observer = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce function for suggestions
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch suggestions
  const fetchSuggestions = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const response = await api.get(`/media/search?query=${encodeURIComponent(query)}&page=1&limit=5`);
      setSuggestions(response.data.results);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Debounced suggestion fetcher
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    []
  );

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);
    debouncedFetchSuggestions(query);
  };

  const searchMedia = async (pageNumber, isNewSearch = false) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setShowSuggestions(false);

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
      setError('Failed to search media');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSearch = async (e) => {
    e?.preventDefault();
    setPage(1);
    setHasMore(true);
    await searchMedia(1, true);
  };  

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
    <div className="min-h-screen bg-gray-900 border border-red-800 rounded-lg shadow-lg">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-300 text-transparent bg-clip-text animate-fade-in">
          Movie 検索
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unleash your next obsession. Discover the darkest, most thrilling movies and shows in our collection.
          </p>
        </div>

        {/* Search Form with Suggestions */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-red-400" />
            </div>
            <Input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for your next obsession..."
              className="w-full pl-12 pr-4 py-6 bg-gray-800 border-2 border-red-800 focus:border-red-500 rounded-xl text-white placeholder:text-gray-500 shadow-lg shadow-red-900/20 transition-all duration-300"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                }}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-800 hover:bg-red-700 rounded-lg border border-red-600"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Search</span>
              )}
            </Button>
          </div>

          {/* Real-time Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-2 bg-gray-800 rounded-xl shadow-xl border-2 border-red-800 overflow-hidden"
            >
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between border-b border-red-900 last:border-none"
                >
                  <div className="flex items-center space-x-4">
                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                        alt={item.title || item.name}
                        className="w-12 h-16 object-cover rounded-lg border border-red-800"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-700 rounded-lg flex items-center justify-center border border-red-800">
                        <Star className="h-6 w-6 text-red-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-white">
                        {item.title || item.name}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {item.release_date || item.first_air_date}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShowDetails(item)}
                      className="border-red-800 hover:bg-gray-700 text-red-400"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        handleAddToList(item);
                        setShowSuggestions(false);
                      }}
                      className="bg-red-800 hover:bg-red-700 border border-red-600"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map((media, index) => (
            <div 
              key={`${media.id}-${index}`}
              ref={index === searchResults.length - 1 ? lastElementRef : null}
              className="bg-gray-800 rounded-xl shadow-lg hover:shadow-red-900/30 transition-all duration-300 overflow-hidden border-2 border-red-900 hover:border-red-700 transform hover:-translate-y-1"
            >
              {media.poster_path ? (
                <div className="relative group">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                    alt={media.title || media.name}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-red-900 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                  <Star className="h-12 w-12 text-red-400" />
                </div>
              )}
              <div className="p-4 flex flex-col">
                <h3 className="font-bold text-lg text-white mb-2 line-clamp-1">
                  {media.title || media.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">
                  {media.overview}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-red-900/50 text-red-300 border border-red-800 capitalize">
                    {media.media_type}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowDetails(media)}
                      className="border-red-800 hover:bg-gray-700 text-red-400"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddToList(media)}
                      className="bg-red-800 hover:bg-red-700 border border-red-600"
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
            <Loader2 className="h-6 w-6 animate-spin text-red-400" />
          </div>
        )}

        {/* Empty State */}
        {searchResults.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {searchQuery ? 'No results found. Try a different search.' : 'Start searching to unleash your next obsession.'}
            </p>
          </div>
        )}

        {/* Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md bg-gray-800 rounded-xl border-2 border-red-800">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedMedia?.title || selectedMedia?.name}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Released: {selectedMedia?.release_date || selectedMedia?.first_air_date}
              </DialogDescription>
            </DialogHeader>
            {selectedMedia && (
              <div className="space-y-4">
                <img
                  src={`https://image.tmdb.org/t/p/w500${selectedMedia.poster_path}`}
                  alt={selectedMedia.title || selectedMedia.name}
                  className="w-full h-64 object-cover rounded-lg border border-red-800"
                />
                <p className="text-sm text-gray-400">{selectedMedia.overview}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">Rating:</span>
                  <span className="text-sm text-red-400">
                    {selectedMedia.vote_average?.toFixed(1)} / 10
                  </span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)} className="bg-red-800 hover:bg-red-700 border border-red-600">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SearchMedia;