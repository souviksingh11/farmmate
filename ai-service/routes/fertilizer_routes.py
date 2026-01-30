from flask import Blueprint, request, jsonify
from services.fertilizer_service import recommend_fertilizer

fertilizer_bp = Blueprint("fertilizer", __name__)

SOIL_NPK_MAP = {
    # Common soils
    "Loamy": {
        "N": 60, "P": 30, "K": 30
    },
    "Sandy": {
        "N": 30, "P": 15, "K": 15
    },
    "Clay": {
        "N": 45, "P": 25, "K": 20
    },
    "Black": {   # Regur soil
        "N": 50, "P": 28, "K": 25
    },

    # Indian major soils
    "Alluvial": {
        "N": 55, "P": 27, "K": 28
    },
    "Red": {
        "N": 40, "P": 20, "K": 20
    },
    "Laterite": {
        "N": 35, "P": 18, "K": 15
    },

    # Special soils
    "Saline": {
        "N": 25, "P": 12, "K": 10
    },
    "Peaty": {
        "N": 65, "P": 30, "K": 35
    },
    "Chalky": {
        "N": 30, "P": 20, "K": 15
    },

    # Fallback / unknown
    "Unknown": {
        "N": 40, "P": 20, "K": 20
    }
}


@fertilizer_bp.route("/api/recommend-fertilizer", methods=["POST"])
def recommend():
    data = request.json or {}

    crop = data.get("crop")
    soil = data.get("soil", )

    # ✅ SAFE CHECK FOR NPK
    if data.get("N") is None or data.get("P") is None or data.get("K") is None:
        npk = SOIL_NPK_MAP.get(soil, {"N": 40, "P": 20, "K": 20})
        N, P, K = npk["N"], npk["P"], npk["K"]
    else:
        N = float(data["N"])
        P = float(data["P"])
        K = float(data["K"])

    fertilizer = recommend_fertilizer([N, P, K, crop])

    recommendation = f"""
Crop: {crop}
Soil Type: {soil}

Estimated Soil Nutrients:
• Nitrogen (N): {N}
• Phosphorus (P): {P}
• Potassium (K): {K}

Recommended Fertilizer: {fertilizer}

Why this fertilizer?
{fertilizer} supplies essential nutrients required for healthy growth of {crop}.
It improves yield, root strength, and nutrient absorption.

Application Guidelines:
• Apply in 2–3 split doses
• Follow crop growth stages
• Ensure proper irrigation

Precautions:
• Avoid application before heavy rainfall
• Do not overuse fertilizer
""".strip()

    return jsonify({
        "fertilizer": fertilizer,
        "recommendation": recommendation
    })
