import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { login, register, me, logout } from '../controllers/authController.js';
import {
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, me);
router.post('/logout', authenticate, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;


