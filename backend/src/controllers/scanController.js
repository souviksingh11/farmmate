import Scan from '../models/Scan.js';
import axios from "axios";

// Smart detection function
function detectDiseaseInfo(disease, confidence) {
  const d = disease.toLowerCase();

  if (d.includes("healthy")) {
    return {
      type: "healthy",
      severity: "None",
      fertilizer: "Balanced NPK",
      treatment: ["Crop is healthy. Maintain proper care."]
    };
  }

  if (d.includes("bacterial")) {
    return {
      type: "bacterial",
      severity: confidence > 0.9 ? "High" : "Medium",
      fertilizer: "Low Nitrogen Fertilizer",
      treatment: [
        "Apply copper-based bactericide.",
        "Remove infected leaves.",
        "Avoid overhead irrigation."
      ]
    };
  }

  if (d.includes("virus")) {
  return {
    type: "viral",
    severity: confidence > 0.8 ? "High" : "Medium",
    fertilizer: "Balanced NPK + Micronutrients",
    treatment: [
      "Remove infected plants immediately.",
      "Control whiteflies using insecticides.",
      "Use virus-resistant crop varieties.",
      "Maintain field hygiene."
    ]
  };
}


  if (
    d.includes("rust") ||
    d.includes("blight") ||
    d.includes("spot") ||
    d.includes("scorch") ||
    d.includes("scab")
  ) {
    return {
      type: "fungal",
      severity: confidence > 0.9 ? "High" : "Medium",
      fertilizer: "NPK 10-10-10",
      treatment: [
        "Apply recommended fungicide.",
        "Remove infected leaves.",
        "Ensure proper airflow.",
        "Avoid excess moisture."
      ]
    };
  }

  return {
    type: "unknown",
    severity: "Unknown",
    fertilizer: "Consult expert",
    treatment: [
      "Monitor crop closely.",
      "Consult agricultural expert."
    ]
  };
}

export async function createScan(req, res, next) {
  try {
    const { imageUrl } = req.body;

    const aiResponse = await axios.post(
      "http://localhost:5001/predict",
      { image: imageUrl },
      { headers: { "Content-Type": "application/json" } }
    );

    const { disease, confidence } = aiResponse.data;

    const diseaseInfo = detectDiseaseInfo(disease, confidence);

    const resultData = {
      disease,
      confidence,
      type: diseaseInfo.type,
      severity: diseaseInfo.severity,
      fertilizer: diseaseInfo.fertilizer,
      recommendations: diseaseInfo.treatment
    };

    const scan = await Scan.create({
      user: req.user._id,
      imageUrl,
      result: resultData
    });

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
