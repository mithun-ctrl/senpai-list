import axios from 'axios';
import { config } from '../config.js';

const tmdbApi = axios.create({
    baseURL: config.TMDB_BASE_URL,
    params: {
        api_key: config.TMDB_API_KEY
    }
});

export const searchMedia = async (query, type = 'multi') => {
    try {
        const response = await tmdbApi.get('/search/multi', {
            params: {
                query,
                include_adult: false
            }
        });
        return response.data.results;
    } catch (error) {
        throw new Error('Failed to search media');
    }
};

export const getMediaDetails = async (id, type) => {
    try {
        const response = await tmdbApi.get(`/${type}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch media details');
    }
};

