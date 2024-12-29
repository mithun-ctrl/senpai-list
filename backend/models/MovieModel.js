import mongoose from 'mongoose';

const movieListSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    tmdbId: { 
        type: Number, 
        required: true 
    },
    mediaType: { 
        type: String, 
        enum: ['movie', 'tv', 'anime'], 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    posterPath: String,
    status: { 
        type: String, 
        enum: ['planning', 'in_progress', 'completed', 'on_hold', 'dropped'],
        default: 'planning'
    },
    progress: { 
        currentEpisode: { type: Number, default: 0 },
        totalEpisodes: { type: Number }
    },
    userRating: { 
        type: Number, 
        min: 0, 
        max: 10,
        default: null
    },
    notes: String,
    updatedAt: { 
        type: Date, 
        default: () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) 
    }
});

export const MovieList = mongoose.model('MovieList', movieListSchema);