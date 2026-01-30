// src/models/Plan.js
import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // or true if you always store user
    },
    crop: {
      type: String,
      required: true,
      trim: true,
    },
    recommendation: {
      type: String,
      required: true,
      trim: true,
    },
    // you can add more fields if you already use them:
    // soil: String,
    // ph: String,
    // n: String,
    // p: String,
    // k: String,
    // size: String,
  },
  { timestamps: true }
);

// IMPORTANT: third argument 'fertilizerplans' makes it use
// the existing MongoDB collection you already have.
const Plan = mongoose.model('Plan', planSchema, 'fertilizerplans');

export default Plan;
