import React, { useState, useEffect } from 'react';
import { Loader2, Star, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const TopAnime = () => {
  const [topAnime, setTopAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/anime/top');
        setTopAnime(response.data.results);
      } catch (err) {
        setError('Failed to fetch top anime data');
        toast.error('Failed to load top anime data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8 bg-gray-900">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gray-900 min-h-screen p-6">
      <Card className="border-red-800 bg-gray-900 shadow-lg shadow-red-900/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-red-500 tracking-wider">
            Legendary Tales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topAnime.map((anime) => (
              <Card key={anime.id} className="bg-gray-800 border-red-900 hover:border-red-600 transition-colors duration-300">
                <CardContent className="p-4">
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-48 object-cover rounded-lg shadow-md shadow-red-900/20"
                  />
                  <h3 className="font-semibold text-red-400 my-2 line-clamp-1 hover:text-red-300">
                    {anime.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-yellow-500 font-semibold">{anime.score}</span>
                    <span className="text-gray-400 text-sm">Rank #{anime.rank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-500 text-sm font-semibold">
                      {anime.type} ({anime.episodes || '?'} eps)
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToList(anime)}
                      className="bg-red-900 hover:bg-red-800 text-white transition-colors duration-300"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopAnime;