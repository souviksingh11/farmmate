import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';
import {
  getOverview,
  listUsers,
  getUserDetails,
  getActivity,
} from '../controllers/adminController.js';

const router = Router();

// All routes here require: logged in + role === 'admin'
router.use(authenticate, authorizeRoles('admin'));

// GET /api/admin/overview
router.get('/overview', getOverview);

// GET /api/admin/users
router.get('/users', listUsers);

// GET /api/admin/users/:id
router.get('/users/:id', getUserDetails);

// GET /api/admin/activity
router.get('/activity', getActivity);

export default router;
