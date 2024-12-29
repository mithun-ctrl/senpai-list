import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    addToList,
    updateProgress,
    getUserList,
    getUserStats,
    searchAnime,
    getSuggestions,
    bulkUpdateStatus,
    deleteSingleList,
    deleteAllList,
    getRecentRecommendations,
    getSeasonUpcoming,
    getTopAnime,

} from '../controllers/animeController.js';
import { progressEpisode } from '../controllers/mediaController.js';

const router = express.Router();

router.get('/search', searchAnime);

router.use(authenticateToken);
router.post('/list', addToList);
router.put('/list/:id', updateProgress);
router.get('/list', getUserList);
router.get('/stats', getUserStats);
router.get('/search', searchAnime);
router.get('/suggestions', getSuggestions);
router.post('/bulk-status', bulkUpdateStatus);
router.put('/list/:id/process', progressEpisode);
router.delete('/list/:id', deleteSingleList)
router.delete('/list', deleteAllList)
router.get('/recommendations', getRecentRecommendations);
router.get('/upcoming', getSeasonUpcoming);
router.get('/top', getTopAnime);

export default router;