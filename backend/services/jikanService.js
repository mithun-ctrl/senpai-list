import axios from 'axios';
import { config } from '../config.js';

class AnimeService {
    constructor() {
        this.baseUrl = config.JIKAN_BASE_URL;
    }

    async searchAnime(query, page = 1) {
        try {
            const response = await axios.get(`${this.baseUrl}/anime`, {
                params: {
                    q: query,
                    page: page,
                    limit: 15
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to search anime: ${error.message}`);
        }
    }

    async getAnimeDetails(animeId) {
        try {
            const response = await axios.get(`${this.baseUrl}/anime/${animeId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get anime details: ${error.message}`);
        }
    }

    async getRecentRecommendations() {
        try {
            const response = await axios.get(`${this.baseUrl}/recommendations/anime`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get recommendations: ${error.message}`);
        }
    }

    async getSeasonUpcoming() {
        try {
            const response = await axios.get(`${this.baseUrl}/seasons/upcoming`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get upcoming season: ${error.message}`);
        }
    }

    async getTopAnime() {
        try {
            const response = await axios.get(`${this.baseUrl}/top/anime`, {
                params: {
                    limit: 10
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get top anime: ${error.message}`);
        }
    }
}

export default new AnimeService();