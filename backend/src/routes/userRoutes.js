import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { updateProfile, uploadAvatar, removeAvatar } from '../controllers/authController.js';
import { multerUpload } from '../utils/uploadImage.js';

const router = Router();

router.use(authenticate); // All routes require authentication
router.put('/me', updateProfile);
router.post('/me/avatar', multerUpload.single('avatar'), uploadAvatar);
router.delete('/me/avatar', removeAvatar);

export default router;


