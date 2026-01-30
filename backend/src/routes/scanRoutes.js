import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { createScan, listScans } from '../controllers/scanController.js';

const router = Router();

router.use(authenticate);
router.get('/', listScans);
router.post('/', createScan);

export default router;


