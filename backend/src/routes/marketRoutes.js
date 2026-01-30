import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getMarketPrices } from '../controllers/marketController.js';

const router = Router();

// Optionally protect with auth so only logged-in users see prices
router.use(authenticate);

router.get('/prices', getMarketPrices);

export default router;
