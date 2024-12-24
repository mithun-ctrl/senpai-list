import { MediaItem } from '../models/MediaItem.js';
import * as tmdbService from '../services/tmdbService.js';
import axios from 'axios';
import mongoose from 'mongoose';

// Add config import or define configuration
const config = {
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    TMDB_API_KEY: process.env.TMDB_API_KEY // Make sure this is set in your environment variables
};

export const addToList = async (req, res) => {
    try {
        const { tmdbId, mediaType, status } = req.body;
        const userId = req.user._id;

        // Fetch media details from TMDB
        const mediaDetails = await tmdbService.getMediaDetails(tmdbId, mediaType);
        
        const mediaItem = new MediaItem({
            userId,
            tmdbId,
            mediaType,
            title: mediaDetails.title || mediaDetails.name,
            posterPath: mediaDetails.poster_path,
            status,
            progress: {
                totalEpisodes: mediaType === 'tv' ? mediaDetails.number_of_episodes : null
            }
        });

        await mediaItem.save();
        res.status(201).json(mediaItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, currentEpisode, userRating, notes } = req.body;

        const mediaItem = await MediaItem.findOne({ _id: id, userId: req.user._id });
        if (!mediaItem) {
            return res.status(404).json({ message: 'Media item not found' });
        }

        if (status) mediaItem.status = status;
        if (currentEpisode !== undefined) mediaItem.progress.currentEpisode = currentEpisode;
        if (userRating !== undefined) mediaItem.userRating = userRating;
        if (notes !== undefined) mediaItem.notes = notes;

        mediaItem.updatedAt = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        await mediaItem.save();

        res.json(mediaItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserList = async (req, res) => {
    try {
        const userId = req.user._id;
        const { 
            status, 
            mediaType, 
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
        if (mediaType) query.mediaType = mediaType;
        if (rating) query.userRating = { $gte: parseInt(rating) };
        
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
        
        const [mediaItems, total] = await Promise.all([
            MediaItem.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit)),
            MediaItem.countDocuments(query)
        ]);

        res.json({
            items: mediaItems,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            hasMore: skip + mediaItems.length < total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const stats = await MediaItem.aggregate([
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
                    byMediaType: {
                        $push: {
                            k: "$mediaType",
                            v: 1
                        }
                    },
                    avgRating: { $avg: "$userRating" },
                    completedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalItems: 1,
                    byStatus: { $arrayToObject: "$byStatus" },
                    byMediaType: { $arrayToObject: "$byMediaType" },
                    avgRating: { $round: ["$avgRating", 1] },
                    completedCount: 1
                }
            }
        ]);

        res.json(stats[0] || {
            totalItems: 0,
            byStatus: {},
            byMediaType: {},
            avgRating: 0,
            completedCount: 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const searchMedia = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Search in TMDB API
        const response = await axios.get(`${config.TMDB_BASE_URL}/search/multi`, {
            params: {
                api_key: config.TMDB_API_KEY,
                query: query,
                include_adult: false
            }
        });

        // Filter and format the results
        const filteredResults = response.data.results
            .filter(item => item.media_type === 'tv' || item.media_type === 'movie')
            .map(item => ({
                id: item.id,
                title: item.title || item.name,
                overview: item.overview,
                poster_path: item.poster_path,
                media_type: item.media_type,
                release_date: item.release_date || item.first_air_date,
                vote_average: item.vote_average
            }));

        res.json({
            results: filteredResults,
            total_results: filteredResults.length
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Failed to search media' });
    }
};

export const episodeProgress = async (req, res) => {
    try {
      const { id } = req.params;
      const { currentEpisode, totalEpisodes } = req.body.progress;
      
      // Validate input
      if (currentEpisode < 0 || totalEpisodes < 0) {
        return res.status(400).json({ 
          error: 'Episode counts cannot be negative' 
        });
      }
      
      if (currentEpisode > totalEpisodes) {
        return res.status(400).json({ 
          error: 'Current episode cannot exceed total episodes' 
        });
      }
  
      const media = await Media.findOne({ 
        _id: id, 
        userId: req.user._id 
      });
  
      if (!media) {
        return res.status(404).json({ error: 'Media not found' });
      }
  
      // Update progress
      media.progress = {
        currentEpisode,
        totalEpisodes,
        lastUpdated: new Date()
      };
  
      // Auto-update status if completed
      if (currentEpisode === totalEpisodes && totalEpisodes > 0) {
        media.status = 'completed';
      } else if (currentEpisode > 0 && media.status === 'planning') {
        media.status = 'in_progress';
      }
  
      await media.save();
  
      res.json(media);
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export const deleteSingleList = async (req, res) =>{
    try {
        const { id } = req.params;
    
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ 
            error: 'Invalid ID format' 
          });
        }
    
        const deletedItem = await MediaItem.findOneAndDelete({
          _id: id,
          userId: req.user._id
        });
    
        if (!deletedItem) {
          return res.status(404).json({ 
            error: 'Media item not found or unauthorized' 
          });
        }
    
        res.status(200).json({ 
          message: 'Media item deleted successfully',
          deletedItem 
        });
    
      } catch (error) {
        console.error('Error deleting media item:', error);
        res.status(500).json({ 
          error: 'Internal server error' 
        });
      }
};

export const deleteAllList = async (req, res) => {

    try {
        const result = await MediaItem.deleteMany({
          userId: req.user._id
        });
    
        if (result.deletedCount === 0) {
          return res.status(404).json({ 
            message: 'No media items found to delete' 
          });
        }
    
        res.status(200).json({ 
          message: 'All media items deleted successfully',
          deletedCount: result.deletedCount 
        });
    
      } catch (error) {
        console.error('Error deleting all media items:', error);
        res.status(500).json({ 
          error: 'Internal server error' 
        });
      }
}

export const progressEpisode = async (req, res) =>{
  try {
      const { id } = req.params;
      const { currentEpisode, totalEpisodes } = req.body;

      if (currentEpisode < 0 || totalEpisodes < 0) {
          return res.status(400).json({ message: 'Episode counts cannot be negative' });
        }
        
      if (currentEpisode > totalEpisodes) {
      return res.status(400).json({ message: 'Current episode cannot exceed total episodes' });
      }
      
      const mediaItem = await MediaItem.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      {
          $set: {
          'progress.currentEpisode': currentEpisode,
          'progress.totalEpisodes': totalEpisodes,
          updatedAt: new Date()
          }
      },
      { new: true }
      );
      
      if (!mediaItem) {
      return res.status(404).json({ message: 'Media item not found' });
      }
    
      // If progress is complete, optionally update status
      if (currentEpisode === totalEpisodes && totalEpisodes > 0) {
      mediaItem.status = 'completed';
      await mediaItem.save();
      }
    
      res.json(mediaItem);
  
  }catch(error){
      console.error('Error updating progress:', error);
      res.status(500).json({ message: 'Error updating progress' });
  }
}