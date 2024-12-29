import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, Loader2, Plus, Star, Info, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import AnimeDialog from '../components/AnimeDialog';

import { Input } from "@/components/ui/input";
import api from '../utils/api';

const AnimeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAnime, setSelectedAnime] = useState(null);
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
      const response = await api.get(`/anime/suggestions?query=${encodeURIComponent(query)}`);
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

  const searchAnime = async (pageNumber, isNewSearch = false) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setShowSuggestions(false);

    try {
      const response = await api.get(`/anime/search?query=${encodeURIComponent(searchQuery)}&page=${pageNumber}`);
      const newResults = response.data.results;
      setHasMore(newResults.length > 0);
      
      if (isNewSearch) {
        setSearchResults(newResults);
      } else {
        setSearchResults(prev => [...prev, ...newResults]);
      }
      
      setInitialSearch(true);
    } catch (err) {
      setError('Failed to search anime');
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
    await searchAnime(1, true);
  };  

  useEffect(() => {
    if (page > 1) {
      searchAnime(page, false);
    }
  }, [page]);

  const handleAddToList = async (anime) => {
    const loadingToast = toast.loading('Adding to list...', {
      position: 'top-center'
    });

    try {
      await api.post('/anime/list', {
        animeId: anime.id,
        status: 'planing'
      });
      
      toast.dismiss(loadingToast);
      toast.success(`Added "${anime.title}" to your list!`, {
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

  const handleShowDetails = (anime) => {
    setSelectedAnime(anime);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 border border-purple-800 rounded-lg shadow-lg">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 text-transparent bg-clip-text animate-fade-in">
            Anime 検索
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
          Embark on an epic anime adventure! Dive into thousands of captivating titles and craft your ultimate watchlist of must-see series
          </p>
        </div>

        {/* Search Form with Suggestions */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-purple-400" />
            </div>
            <Input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for anime..."
              className="w-full pl-12 pr-4 py-6 bg-gray-800 border-2 border-purple-800 focus:border-purple-500 rounded-xl text-white placeholder:text-gray-500 shadow-lg shadow-purple-900/20 transition-all duration-300"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                }}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-800 hover:bg-purple-700 rounded-lg border border-purple-600"
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
              className="absolute z-50 w-full mt-2 bg-gray-800 rounded-xl shadow-xl border-2 border-purple-800 overflow-hidden max-h-[60vh] overflow-y-auto"
            >
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-700 transition-colors duration-200 border-b border-purple-900 last:border-none"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-24 h-32 object-cover rounded-lg border border-purple-800"
                        />
                      ) : (
                        <div className="w-24 h-32 bg-gray-700 rounded-lg flex items-center justify-center border border-purple-800">
                          <Star className="h-8 w-8 text-purple-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold text-white line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="flex-shrink-0 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleShowDetails(item)}
                            className="border-purple-800 hover:bg-gray-700 text-purple-400"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              handleAddToList(item);
                              setShowSuggestions(false);
                            }}
                            className="bg-purple-800 hover:bg-purple-700 border border-purple-600"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-400 line-clamp-2">
                        {item.synopsis || 'No synopsis available.'}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div className="text-purple-300">Type: <span className="text-gray-400">{item.type || 'Unknown'}</span></div>
                        <div className="text-purple-300">Status: <span className="text-gray-400">{item.status || 'Unknown'}</span></div>
                        <div className="text-purple-300">Rating: <span className="text-gray-400">{item.rating || 'Unknown'}</span></div>
                        <div className="text-purple-300">Score: <span className="text-gray-400">{item.score ? `${item.score}/10` : 'N/A'}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map((anime, index) => (
            <div 
              key={`${anime.id}-${index}`}
              ref={index === searchResults.length - 1 ? lastElementRef : null}
              className="bg-gray-800 rounded-xl shadow-lg hover:shadow-purple-900/30 transition-all duration-300 overflow-hidden border-2 border-purple-900 hover:border-purple-700 transform hover:-translate-y-1"
            >
              {anime.image ? (
                <div className="relative group">
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-purple-900 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                  <Star className="h-12 w-12 text-purple-400" />
                </div>
              )}
              <div className="p-4 flex flex-col">
                <h3 className="font-bold text-lg text-white mb-2 line-clamp-1">
                  {anime.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">
                  {anime.synopsis}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 border border-purple-800 capitalize">
                    {anime.type}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowDetails(anime)}
                      className="border-purple-800 hover:bg-gray-700 text-purple-400"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddToList(anime)}
                      className="bg-purple-800 hover:bg-purple-700 border border-purple-600"
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
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          </div>
        )}

        {/* Empty State */}
        {searchResults.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {searchQuery ? 'No results found. Try a different search.' : 'Start searching to discover new anime.'}
            </p>
          </div>
        )}

        {/* Details Dialog */}
        <AnimeDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          selectedAnime={selectedAnime}
          handleAddToList={handleAddToList}
        />

        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-4 right-4">
            <div className="bg-red-900 text-white px-4 py-2 rounded-lg shadow-lg">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeSearch;