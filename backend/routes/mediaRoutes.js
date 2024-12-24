import express from 'express';
import { progressEpisode, addToList, updateProgress, getUserList, getUserStats, searchMedia, episodeProgress, deleteSingleList, deleteAllList } from '../controllers/mediaController.js';
import { authenticateToken } from '../middleware/auth.js';
import { MediaItem } from '../models/MediaItem.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/list', addToList);
router.put('/list/:id', updateProgress);
router.get('/list', getUserList);
router.get('/stats', getUserStats);
router.get('/search', searchMedia);
router.put('/list/:id/progress', progressEpisode);
router.delete('/list/:id', deleteSingleList)
router.delete('/list', deleteAllList)
export default router;