import mongoose from "mongoose";

const animeListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    animeId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: String,
    status: {
        type: String,
        enum: ['watching', 'completed', 'planing', 'on_hold', 'dropped'],
        default: 'planing'
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    progress: {
        currentEpisode: { type: Number, default: 0 },
        totalEpisodes: { type: Number }
    },
    notes: String,
    updatedAt: { 
        type: Date, 
        default: () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) 
    }
});

animeListSchema.index({ userId: 1, animeId: 1 }, { unique: true });

export default mongoose.model('AnimeList', animeListSchema);