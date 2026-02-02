from flask import Blueprint, request, jsonify
from services.fertilizer_service import recommend_fertilizer

fertilizer_bp = Blueprint("fertilizer", __name__)

# 🌱 Soil Nutrient Approximation Map
SOIL_NPK_MAP = {

    # Common soils
    "Loamy": {"N": 60, "P": 30, "K": 30},
    "Sandy": {"N": 30, "P": 15, "K": 15},
    "Clay": {"N": 45, "P": 25, "K": 20},
    "Black": {"N": 50, "P": 28, "K": 25},

    # Indian major soils
    "Alluvial": {"N": 55, "P": 27, "K": 28},
    "Red": {"N": 40, "P": 20, "K": 20},
    "Laterite": {"N": 35, "P": 18, "K": 15},

    # Special soils
    "Saline": {"N": 25, "P": 12, "K": 10},
    "Peaty": {"N": 65, "P": 30, "K": 35},
    "Chalky": {"N": 30, "P": 20, "K": 15},

    # Default
    "Unknown": {"N": 40, "P": 20, "K": 20}
}


@fertilizer_bp.route("/api/recommend-fertilizer", methods=["POST"])
def recommend():
    data = request.json or {}

    crop = data.get("crop", "Unknown")
    soil = data.get("soil", "Unknown")

    # ✅ Safe NPK Handling
    if data.get("N") is None or data.get("P") is None or data.get("K") is None:
        npk = SOIL_NPK_MAP.get(soil, SOIL_NPK_MAP["Unknown"])
        N, P, K = npk["N"], npk["P"], npk["K"]
    else:
        N = float(data["N"])
        P = float(data["P"])
        K = float(data["K"])

    # 🌾 Get fertilizer recommendation
    fertilizer = recommend_fertilizer([N, P, K, crop])

    # 📋 Farmer-Friendly Recommendation Text
    recommendation_text = f"""
Crop: {crop}
Soil Type: {soil}

Soil Nutrient Levels:
Nitrogen: {N}
Phosphorus: {P}
Potassium: {K}

Recommended Fertilizer:
{fertilizer}

Why to use this fertilizer?
This fertilizer helps improve the growth and productivity of {crop}.
It strengthens roots, improves nutrient absorption, and increases crop yield.

How to apply:
• Apply in 2 to 3 split doses during crop growth.
• Provide proper irrigation after application.
• Follow recommended quantity.

Important precautions:
• Do not apply before heavy rainfall.
• Avoid overuse to prevent soil damage.
• Follow soil testing advice if available.
""".strip()

    return jsonify({
        "crop": crop,
        "soil": soil,
        "nutrients": {
            "N": N,
            "P": P,
            "K": K
        },
        "fertilizer": fertilizer,
        "why": f"""
{fertilizer} provides essential nutrients needed for {crop}.
It improves root development, strengthens plant structure,
enhances nutrient absorption, and increases overall yield.
It also improves resistance against environmental stress.
""".strip(),
        "application": [
            "Apply in 2–3 split doses",
            "Water properly after application",
            "Follow recommended quantity"
        ],
        "precautions": [
            "Do not apply before heavy rainfall",
            "Avoid excessive use",
            "Follow soil test recommendations"
        ],
        "recommendation_text": recommendation_text
    })
