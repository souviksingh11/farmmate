import Farm from '../models/Farm.js';

export async function createFarm(req, res, next) {
  try {
    const farm = await Farm.create({ ...req.body, owner: req.user._id });
    res.status(201).json(farm);
  } catch (err) {
    next(err);
  }
}

export async function getMyFarms(req, res, next) {
  try {
    const farms = await Farm.find({ owner: req.user._id });
    res.json(farms);
  } catch (err) {
    next(err);
  }
}

export async function updateFarm(req, res, next) {
  try {
    const farm = await Farm.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    res.json(farm);
  } catch (err) {
    next(err);
  }
}

export async function deleteFarm(req, res, next) {
  try {
    const farm = await Farm.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}


