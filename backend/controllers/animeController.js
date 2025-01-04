import AnimeList from '../models/AnimeModel.js';
import animeService from '../services/jikanService.js';
import mongoose from 'mongoose';

const CACHE = new Map();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

const getOrSetCache = async (key, fetchFn) => {
    const now = Date.now();
    if (CACHE.has(key)) {
        const { data, timestamp } = CACHE.get(key);
        if (now - timestamp < CACHE_DURATION) {
            return data;
        }
    }

    const data = await fetchFn();
    CACHE.set(key, { data, timestamp: now });
    return data;
};

export const getSuggestions = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.status(400).json({
                error: 'Query must be at least 2 characters long'
            });
        }

        const cacheKey = `anime_suggestions:${query}`;
        const suggestions = await getOrSetCache(cacheKey, async () => {
            const response = await animeService.searchAnime(query, 1);

            return response.data
                .slice(0, 5)
                .map(item => ({
                    id: item.mal_id,
                    title: item.title_english || item.title,
                    original_title: item.title,
                    type: item.type || 'Unknown',
                    synopsis: item.synopsis,
                    image: item.images?.jpg?.image_url,
                    status: item.status || 'Unknown',
                    rating: item.rating || 'Unknown',
                    score: item.score,
                    season: item.season,
                    broadcast: item.broadcast?.string,
                    aired: {
                        from: item.aired?.from,
                        to: item.aired?.to
                    },
                    genres: item.genres?.map(genre => genre.name) || [],
                    studios: item.studios?.map(studio => studio.name) || [],
                    episodes: item.episodes,
                    duration: item.duration,
                    popularity: item.popularity,
                    trailer: item.trailer?.url || null,
                    // Additional metadata
                    source: item.source,
                    airing: item.airing,
                    demographics: item.demographics?.map(demo => demo.name) || []
                }));
        });

        res.json({
            results: suggestions,
            success: true
        });
    } catch (error) {
        console.error('Suggestion Error:', error);
        res.status(500).json({
            error: 'Failed to fetch suggestions',
            message: error.message,
            success: false
        });
    }
};

export const searchAnime = async (req, res) => {
    try {
        const { query, page = 1 } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const cacheKey = `anime_search:${query}:${page}`;
        const results = await getOrSetCache(cacheKey, async () => {
            const response = await animeService.searchAnime(query, page);

            // Check if anime is already in user's list
            const userId = req.user?._id;
            const userItems = userId ?
                await AnimeList.find({
                    userId,
                    animeId: {
                        $in: response.data.map(item => item.mal_id)
                    }
                }) : [];

            const userItemMap = new Map(
                userItems.map(item => [item.animeId, item])
            );

            return response.data.map(item => ({
                id: item.mal_id,
                title: item.title_english,
                synopsis: item.synopsis,
                status: item.status || 'Unknown',
                image: item.images.jpg.image_url,
                type: item.type,
                aired: item.aired,
                score: item.score,
                season: item.season || 'Unknown',
                duration: item.duration,
                popularity: item.popularity,
                episodes: item.episodes,
                broadcast: item.broadcast?.string || 'Unknown',
                rating: item.rating || 'Unknown',
                genres: item.genres?.map(genre => genre.name) || [],
                studios: item.studios?.map(studio => studio.name) || [],
                trailer: item.trailer?.url || null,
                userStatus: userItemMap.get(item.mal_id)?.status || null,
                inList: userItemMap.has(item.mal_id),
                demographics: item.demographics?.map(demo => demo.name) || [],
                airing: item.airing,
                source: item.source
            }));
        });

        res.json({
            results,
            page: parseInt(page),
            total_results: results.length
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Failed to search anime' });
    }
};

export const addToList = async (req, res) => {
    try {
        const { animeId, status } = req.body;
        const userId = req.user._id;

        const existing = await AnimeList.findOne({ userId, animeId });
        if (existing) {
            return res.status(400).json({
                message: 'Anime already in your list'
            });
        }

        const animeDetails = await animeService.getAnimeDetails(animeId);

        const animeList = new AnimeList({
            userId,
            animeId,
            title: animeDetails.data.title_english,
            title_english: animeDetails.data.title_english,
            title_japanese: animeDetails.data.title_japanese,
            image: animeDetails.data.images.jpg.image_url,
            status,
            progress: {
                totalEpisodes: animeDetails.data.episodes,
                currentEpisode: 0
            }
        });

        await animeList.save();
        res.status(201).json(animeList);
    } catch (error) {
        console.error('Add to list error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, progress, rating, notes } = req.body;

        const animeList = await AnimeList.findOne({ _id: id, userId: req.user._id });
        if (!animeList) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        // Update progress if provided
        if (progress) {
            animeList.progress = {
                currentEpisode: progress.currentEpisode,
                totalEpisodes: progress.totalEpisodes || animeList.progress.totalEpisodes
            };

            // Auto-update status based on progress
            if (progress.currentEpisode === animeList.progress.totalEpisodes && animeList.progress.totalEpisodes > 0) {
                animeList.status = 'completed';
            } else if (progress.currentEpisode > 0 && animeList.status === 'planing') {
                animeList.status = 'watching';
            }
        }

        // Update other fields if provided
        if (status) animeList.status = status;
        if (rating !== undefined) animeList.rating = rating;
        if (notes !== undefined) animeList.notes = notes;

        animeList.updatedAt = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        await animeList.save();

        res.json(animeList);
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getUserList = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            status,
            sort = 'updatedAt',
            order = 'desc',
            search,
            rating,
            dateFrom,
            dateTo,
            page = 1,
            limit = 10
        } = req.query;

        const query = { userId };

        // Basic filters
        if (status) query.status = status;
        if (rating) query.rating = { $gte: parseInt(rating) };

        // Search by title
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        // Date range filter
        if (dateFrom || dateTo) {
            query.updatedAt = {};
            if (dateFrom) query.updatedAt.$gte = new Date(dateFrom);
            if (dateTo) query.updatedAt.$lte = new Date(dateTo);
        }

        // Sorting options
        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;

        // Pagination
        const skip = (page - 1) * limit;

        const [animeLists, total] = await Promise.all([
            AnimeList.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit))
                .select('title status progress rating image updatedAt'),
            AnimeList.countDocuments(query)
        ]);

        res.json({
            items: animeLists,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            hasMore: skip + animeLists.length < total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = await AnimeList.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalItems: { $sum: 1 },
                    byStatus: {
                        $push: {
                            k: "$status",
                            v: 1
                        }
                    },
                    avgRating: { $avg: "$rating" },
                    completedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    totalEpisodes: {
                        $sum: "$progress.currentEpisode"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalItems: 1,
                    byStatus: { $arrayToObject: "$byStatus" },
                    avgRating: { $round: ["$avgRating", 1] },
                    completedCount: 1,
                    totalEpisodes: 1
                }
            }
        ]);

        res.json(stats[0] || {
            totalItems: 0,
            byStatus: {},
            avgRating: 0,
            completedCount: 0,
            totalEpisodes: 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const episodeProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentEpisode, totalEpisodes } = req.body;

        // Validate input
        if (currentEpisode < 0 || (totalEpisodes !== null && totalEpisodes < 0)) {
            return res.status(400).json({
                error: 'Episode counts cannot be negative'
            });
        }

        if (totalEpisodes !== null && currentEpisode > totalEpisodes) {
            return res.status(400).json({
                error: 'Current episode cannot exceed total episodes'
            });
        }

        const anime = await AnimeList.findOne({
            _id: id,
            userId: req.user._id
        });

        if (!anime) {
            return res.status(404).json({ error: 'Anime not found' });
        }

        // Update progress
        anime.progress = {
            currentEpisode,
            totalEpisodes: totalEpisodes || anime.progress.totalEpisodes
        };

        // Auto-update status based on progress
        if (currentEpisode === anime.progress.totalEpisodes && anime.progress.totalEpisodes > 0) {
            anime.status = 'completed';
        } else if (currentEpisode > 0 && anime.status === 'planing') {
            anime.status = 'watching';
        }

        anime.updatedAt = new Date();
        await anime.save();
        res.json(anime);
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteSingleList = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: 'Invalid ID format'
            });
        }

        const deletedItem = await AnimeList.findOneAndDelete({
            _id: id,
            userId: req.user._id
        });

        if (!deletedItem) {
            return res.status(404).json({
                error: 'Anime not found or unauthorized'
            });
        }

        res.status(200).json({
            message: 'Anime deleted successfully',
            deletedItem
        });

    } catch (error) {
        console.error('Error deleting anime:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const deleteAllList = async (req, res) => {
    try {
        const result = await AnimeList.deleteMany({
            userId: req.user._id
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'No anime found to delete'
            });
        }

        res.status(200).json({
            message: 'All anime deleted successfully',
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('Error deleting all anime:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const bulkUpdateStatus = async (req, res) => {
    try {
        const { ids, status } = req.body;
        const userId = req.user._id;

        if (!Array.isArray(ids) || !ids.length) {
            return res.status(400).json({
                error: 'Invalid or empty ID array'
            });
        }

        const result = await AnimeList.updateMany(
            {
                _id: { $in: ids },
                userId
            },
            {
                $set: {
                    status,
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            message: 'Status updated successfully',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Bulk update error:', error);
        res.status(500).json({
            error: 'Failed to update status'
        });
    }
};

export const getRecentRecommendations = async (req, res) => {
    try {
        const cacheKey = 'recent_recommendations';
        const recommendations = await getOrSetCache(cacheKey, async () => {
            const response = await animeService.getRecentRecommendations();
            const uniqueRecommendations = [];
            const seenIds = new Set();

            response.data.forEach(item => {
                const animeId = item.entry[0].mal_id;
                if (!seenIds.has(animeId)) {
                    seenIds.add(animeId);
                    uniqueRecommendations.push({
                        entry: {
                            id: animeId,
                            title: item.entry[0].title_english || item.entry[0].title || 'Unknown Title',
                            image: item.entry[0].images.jpg.image_url
                        },
                        content: item.content,
                        user: item.user.username
                    });
                }
            });

            return uniqueRecommendations;
        });

        res.json({
            results: recommendations,
            success: true
        });
    } catch (error) {
        console.error('Recommendations Error:', error);
        res.status(500).json({
            error: 'Failed to fetch recommendations',
            message: error.message,
            results: []
        });
    }
};

export const getSeasonUpcoming = async (req, res) => {
    try {
        const cacheKey = 'season_upcoming';
        const upcoming = await getOrSetCache(cacheKey, async () => {
            const response = await animeService.getSeasonUpcoming();
            return response.data.slice(0, 10).map(item => ({
                id: item.mal_id,
                title: item.title_english,
                image: item.images.jpg.image_url,
                type: item.type,
                season: item.season,
                year: item.year,
                aired: item.aired,
                synopsis: item.synopsis
            }));
        });

        res.json({
            results: upcoming,
            success: true
        });
    } catch (error) {
        console.error('Upcoming Season Error:', error);
        res.status(500).json({
            error: 'Failed to fetch upcoming season',
            message: error.message
        });
    }
};
export const getTopAnime = async (req, res) => {
    try {
        const cacheKey = 'top_anime';
        const topAnime = await getOrSetCache(cacheKey, async () => {
            const response = await animeService.getTopAnime();
            return response.data.map(item => ({
                id: item.mal_id,
                title: item.title_english,
                image: item.images.jpg.image_url,
                score: item.score,
                rank: item.rank,
                type: item.type,
                episodes: item.episodes
            }));
        });

        res.json({
            results: topAnime,
            success: true
        });
    } catch (error) {
        console.error('Top Anime Error:', error);
        res.status(500).json({
            error: 'Failed to fetch top anime',
            message: error.message
        });
    }
};