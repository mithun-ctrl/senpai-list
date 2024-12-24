import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, Loader2, Plus, Star, Info, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import api from '../utils/api';

const SearchMedia = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialSearch, setInitialSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const observer = useRef();
  const searchTimeout = useRef(null);
  
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

  // Real-time search suggestions
  const fetchSuggestions = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const response = await api.get(`/media/suggestions?query=${encodeURIComponent(query)}`);
      setSuggestions(response.data.results.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchQuery.length >= 2) {
      searchTimeout.current = setTimeout(() => {
        fetchSuggestions(searchQuery);
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

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

  const handleSearch = async (e) => {
    e?.preventDefault();
    setPage(1);
    setHasMore(true);
    await searchMedia(1, true);
  };

  const handleSuggestionClick = async (suggestion) => {
    setSearchQuery(suggestion.title || suggestion.name);
    setSuggestions([]);
    await handleSearch();
  };

  useEffect(() => {
    if (page > 1) {
      searchMedia(page, false);
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Anime & Media Search
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover your next favorite anime, movie, or TV show
          </p>
        </div>

        {/* Search Form with Suggestions */}
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search anime, movies, shows..."
                className="w-full pl-12 pr-4 py-6 rounded-2xl border-2 border-purple-100 focus:border-purple-300 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                  }}
                  className="absolute right-16 top-1/2 -translate-y-1/2 p-2"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <Card className="absolute z-50 w-full mt-2 border-2 border-purple-100 rounded-xl shadow-lg bg-white/95 backdrop-blur-sm">
              <ul className="divide-y divide-purple-100">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-3 hover:bg-purple-50 cursor-pointer transition-colors flex items-center gap-3"
                  >
                    {suggestion.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${suggestion.poster_path}`}
                        alt=""
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-purple-100 rounded flex items-center justify-center">
                        <Star className="h-6 w-6 text-purple-300" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-800">
                        {suggestion.title || suggestion.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {suggestion.media_type} • {suggestion.release_date?.split('-')[0] || suggestion.first_air_date?.split('-')[0]}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map((media, index) => (
            <div
              key={`${media.id}-${index}`}
              ref={index === searchResults.length - 1 ? lastElementRef : null}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-purple-100 hover:border-purple-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                {media.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                    alt={media.title || media.name}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-64 bg-purple-50 flex items-center justify-center">
                    <Star className="h-12 w-12 text-purple-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-purple-600 transition-colors">
                  {media.title || media.name}
                </h3>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                  {media.overview}
                </p>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-purple-50 text-purple-600">
                    {media.media_type}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMedia(media)}
                      className="border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600" />
          </div>
        )}

        {/* Empty State */}
        {searchResults.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="inline-block p-6 rounded-full bg-purple-50 mb-4">
              <Search className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-slate-600">
              {searchQuery ? 'No results found. Try a different search.' : 'Start your search to discover amazing content!'}
            </p>
          </div>
        )}

        {/* Details Dialog */}
        <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
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
              <Button onClick={() => setSelectedMedia(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SearchMedia;