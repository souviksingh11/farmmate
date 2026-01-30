import mongoose from 'mongoose';

const marketDataSchema = new mongoose.Schema(
  {
    commodity: { type: String, required: true },
    price: { type: Number, required: true },
    location: String,
    source: String,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const MarketData = mongoose.model('MarketData', marketDataSchema);
export default MarketData;


