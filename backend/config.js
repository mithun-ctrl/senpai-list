import dotenv from 'dotenv';
dotenv.config();

export const config = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    JIKAN_BASE_URL: 'https://api.jikan.moe/v4'
};