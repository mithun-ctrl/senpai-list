import React, { useState, useEffect } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const AnimeRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/anime/recommendations');
        setRecommendations(response.data.results);
      } catch (err) {
        setError('Failed to fetch anime recommendations');
        toast.error('Failed to load recommendations');
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
            Curated For Your Dark Desires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <Card key={rec.entry.id} className="bg-gray-800 border-red-900 hover:border-red-600 transition-colors duration-300">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={rec.entry.image}
                      alt={rec.entry.title}
                      className="w-24 h-32 object-cover rounded-lg shadow-md shadow-red-900/20"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-400 mb-2 line-clamp-1 hover:text-red-300">
                        {rec.entry.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                        {rec.content}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleAddToList(rec.entry)}
                        className="bg-red-900 hover:bg-red-800 text-white transition-colors duration-300"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to List
                      </Button>
                    </div>
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

export default AnimeRecommendations;