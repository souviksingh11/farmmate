import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { createFarm, getMyFarms, updateFarm, deleteFarm } from '../controllers/farmController.js';

const router = Router();

router.use(authenticate);
router.get('/', getMyFarms);
router.post('/', createFarm);
router.put('/:id', updateFarm);
router.delete('/:id', deleteFarm);

export default router;


