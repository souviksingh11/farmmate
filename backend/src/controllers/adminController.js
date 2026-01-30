// controllers/adminController.js
import User from '../models/User.js';
import Scan from '../models/Scan.js';
import Plan from '../models/Plan.js';

// 1) Overview stats
export async function getOverview(req, res) {
  try {
    const [userCount, scanCount, planCount] = await Promise.all([
      User.countDocuments(),
      Scan.countDocuments(),
      Plan.countDocuments(),
    ]);

    res.json({ userCount, scanCount, planCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch overview stats' });
  }
}

// 2) List all users
export async function listUsers(req, res) {
  try {
    const users = await User.find()
      .select('name email role farmName location avatarUrl createdAt')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
}

// 3) One user + their activity
export async function getUserDetails(req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      'name email role farmName location avatarUrl createdAt'
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    const [scans, plans] = await Promise.all([
      Scan.find({ user: userId }).sort({ createdAt: -1 }),
      Plan.find({ user: userId }).sort({ createdAt: -1 }),
    ]);

    res.json({ user, scans, plans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
}

// 4) Global activity (last 100 scans + plans)
export async function getActivity(req, res) {
  try {
    const scans = await Scan.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('user', 'name email');

    const plans = await Plan.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('user', 'name email');

    res.json({ scans, plans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch activity' });
  }
}
