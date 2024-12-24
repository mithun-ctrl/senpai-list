import express from 'express';
import { 
    progressEpisode, 
    addToList, 
    updateProgress, 
    getUserList, 
    getUserStats, 
    searchMedia,  
    deleteSingleList, 
    deleteAllList,
    getSuggestions,
    bulkUpdateStatus
} 
from '../controllers/mediaController.js';

import { authenticateToken } from '../middleware/auth.js';


const router = express.Router();

router.use(authenticateToken);

router.post('/list', addToList);
router.put('/list/:id', updateProgress);
router.get('/list', getUserList);
router.get('/stats', getUserStats);
router.get('/search', searchMedia);
router.get('/suggestions', getSuggestions);
router.post('/bulk-status', bulkUpdateStatus);
router.put('/list/:id/progress', progressEpisode);
router.delete('/list/:id', deleteSingleList)
router.delete('/list', deleteAllList)
export default router;