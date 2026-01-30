import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
    imageUrl: String,
    result: {
      disease: String,
      confidence: Number,
      recommendations: [String],
    },
  },
  { timestamps: true }
);

const Scan = mongoose.model('Scan', scanSchema);
export default Scan;


