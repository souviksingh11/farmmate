import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { createPlan, listPlans } from '../controllers/fertilizerController.js';

const router = Router();

router.use(authenticate);
router.get('/', listPlans);
router.post('/', createPlan);

export default router;


