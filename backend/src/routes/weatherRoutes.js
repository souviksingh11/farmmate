import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getWeather } from '../controllers/weatherController.js';

const router = Router();

router.use(authenticate);
router.get('/', getWeather);

export default router;


