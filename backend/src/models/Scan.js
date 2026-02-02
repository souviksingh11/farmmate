import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
    imageUrl: String,

    result: {
      disease: { type: String },
      confidence: { type: Number },
      type: { type: String },        // fungal / bacterial / healthy
      severity: { type: String },    // High / Medium / Low
      fertilizer: { type: String },
      recommendations: [{ type: String }],
    },
  },
  { timestamps: true }
);

const Scan = mongoose.model('Scan', scanSchema);
export default Scan;
