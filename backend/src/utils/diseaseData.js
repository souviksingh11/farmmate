export const diseaseData = {
  // ================= APPLE =================
  "Apple___Apple_scab": {
    type: "fungal",
    fertilizer: "NPK 10-10-10",
    severity: "Medium",
    treatment: [
      "Apply Captan or Mancozeb fungicide.",
      "Prune infected branches.",
      "Improve air circulation."
    ]
  },

  "Apple___Black_rot": {
    type: "fungal",
    fertilizer: "NPK 12-12-12",
    severity: "High",
    treatment: [
      "Remove infected fruits immediately.",
      "Apply fungicide spray weekly.",
      "Sanitize pruning tools."
    ]
  },

  "Apple___Cedar_apple_rust": {
    type: "fungal",
    fertilizer: "NPK 10-10-10",
    severity: "Medium",
    treatment: [
      "Apply Myclobutanil fungicide.",
      "Remove nearby cedar trees if possible.",
      "Prune infected leaves."
    ]
  },

  "Apple___healthy": {
    type: "healthy",
    fertilizer: "Balanced NPK 10-10-10",
    severity: "None",
    treatment: [
      "Crop appears healthy.",
      "Maintain regular irrigation and fertilization."
    ]
  },

  // ================= TOMATO =================
  "Tomato___Target_Spot": {
    type: "fungal",
    fertilizer: "NPK 10-10-10",
    severity: "High",
    treatment: [
      "Apply Chlorothalonil fungicide.",
      "Remove infected leaves.",
      "Avoid overhead irrigation.",
      "Improve drainage."
    ]
  },

  "Tomato___Early_blight": {
    type: "fungal",
    fertilizer: "NPK 12-12-12",
    severity: "Medium",
    treatment: [
      "Apply Mancozeb spray.",
      "Remove infected lower leaves.",
      "Avoid excess nitrogen fertilizer."
    ]
  },

  "Tomato___Late_blight": {
    type: "fungal",
    fertilizer: "NPK 10-10-10",
    severity: "High",
    treatment: [
      "Apply Metalaxyl fungicide.",
      "Remove infected plants immediately.",
      "Avoid excess moisture."
    ]
  },

  "Tomato___healthy": {
    type: "healthy",
    fertilizer: "NPK 10-10-10",
    severity: "None",
    treatment: [
      "Crop is healthy.",
      "Maintain balanced fertilizer schedule."
    ]
  },

  // ================= PEPPER =================
  "Pepper,_bell___Bacterial_spot": {
    type: "bacterial",
    fertilizer: "NPK 10-10-10",
    severity: "Medium",
    treatment: [
      "Apply copper-based bactericide.",
      "Remove infected leaves.",
      "Avoid overhead irrigation."
    ]
  },

  "Pepper,_bell___healthy": {
    type: "healthy",
    fertilizer: "Balanced NPK",
    severity: "None",
    treatment: [
      "Crop is healthy.",
      "Continue proper irrigation."
    ]
  },

  "Corn_(maize)___Common_rust_": {
  type: "fungal",
  severity: "Medium",
  fertilizer: "NPK 10-10-10",
  treatment: [
    "Apply fungicide such as Mancozeb.",
    "Remove infected leaves if severe.",
    "Ensure proper spacing for airflow.",
    "Avoid excess nitrogen fertilizer."
  ]
},

"Strawberry___Leaf_scorch": {
  type: "fungal",
  severity: "Medium",
  fertilizer: "NPK 10-10-10",
  treatment: [
    "Apply appropriate fungicide such as Captan or Mancozeb.",
    "Remove infected leaves immediately.",
    "Avoid overhead irrigation.",
    "Improve air circulation around plants."
  ]
},
"Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
  type: "viral",
  fertilizer: "Balanced NPK + Micronutrients",
  severity: "High",
  treatment: [
    "Remove infected plants immediately.",
    "Control whiteflies using insecticides.",
    "Use virus-resistant varieties.",
    "Maintain field hygiene."
  ]
},

"Tomato___Leaf_Mold": {
  type: "fungal",
  fertilizer: "NPK 10-10-10",
  severity: "Medium",
  treatment: [
    "Apply fungicide such as Chlorothalonil.",
    "Remove infected leaves immediately.",
    "Improve air circulation.",
    "Avoid excessive humidity."
  ]
},


  // 🔥 You can extend remaining classes similarly
};
