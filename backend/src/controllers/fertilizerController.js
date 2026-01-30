import axios from "axios";
import FertilizerPlan from "../models/FertilizerPlan.js";

export async function createPlan(req, res, next) {
  try {
    const { crop, soil, ph, N, P, K, size } = req.body;

    if (!crop) {
      return res.status(400).json({ message: "Crop is required" });
    }

    // 🔥 Call Python AI
    const aiResponse = await axios.post(
      "http://localhost:5001/api/recommend-fertilizer",
      { crop, soil, ph, N, P, K, size }
    );

    const ai = aiResponse.data;

    // ✅ BUILD PART-WISE DISPLAY TEXT
    const recommendation = `
Crop: ${ai.crop}
Soil Type: ${ai.soil}

Estimated Soil Nutrients:
• Nitrogen (N): ${ai.nutrients.N}
• Phosphorus (P): ${ai.nutrients.P}
• Potassium (K): ${ai.nutrients.K}

Recommended Fertilizer:
${ai.fertilizer}

Why this fertilizer?
${ai.why}

Application Guidelines:
${ai.application.map(a => `• ${a}`).join("\n")}

Precautions:
${ai.precautions.map(p => `• ${p}`).join("\n")}
`.trim();

    // 💾 Save to DB
    const plan = await FertilizerPlan.create({
      user: req.user._id,
      crop,
      soilN: ai.nutrients.N,
      soilP: ai.nutrients.P,
      soilK: ai.nutrients.K,
      recommendation
    });

    res.status(201).json(plan);
  } catch (err) {
    next(err);
  }
}

export async function listPlans(req, res, next) {
  try {
    const plans = await FertilizerPlan
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(plans);
  } catch (err) {
    next(err);
  }
}
