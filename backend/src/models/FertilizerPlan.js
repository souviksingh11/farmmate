import mongoose from 'mongoose';

const fertilizerPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
    crop: { type: String, required: true },
    soilN: Number,
    soilP: Number,
    soilK: Number,
    recommendation: {
      type: String,
    },
  },
  { timestamps: true }
);

const FertilizerPlan = mongoose.model('FertilizerPlan', fertilizerPlanSchema);
export default FertilizerPlan;


