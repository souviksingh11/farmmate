import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    areaInAcres: { type: Number, default: 0 },
    crops: [{ type: String }],
  },
  { timestamps: true }
);

const Farm = mongoose.model('Farm', farmSchema);
export default Farm;


