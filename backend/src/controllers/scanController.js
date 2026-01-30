import Scan from '../models/Scan.js';

export async function createScan(req, res, next) {
  try {
    // Placeholder for ML inference integration
    const scan = await Scan.create({ user: req.user._id, ...req.body });
    res.status(201).json(scan);
  } catch (err) {
    next(err);
  }
}

export async function listScans(req, res, next) {
  try {
    const scans = await Scan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(scans);
  } catch (err) {
    next(err);
  }
}


