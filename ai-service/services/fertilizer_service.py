import joblib

# Load trained ML model and encoders
model = joblib.load("models/fertilizer_model.pkl")
crop_encoder = joblib.load("models/crop_encoder.pkl")
fertilizer_encoder = joblib.load("models/fertilizer_encoder.pkl")

# 🌱 Rule-based agriculture knowledge
CROP_BASED_FERTILIZER = {
    "Rice": "Urea",
    "Wheat": "DAP",
    "Maize": "NPK",
    "Pulses": "SSP",
    "Cotton": "NPK",
    "Sugarcane": "Urea",
    "Groundnut": "SSP",
    "Tomato": "NPK",
    "Potato": "DAP"
}

def recommend_fertilizer(data):
    """
    data = [N, P, K, crop]
    """
    N, P, K, crop = data

    # 1️⃣ Rule-based decision (primary)
    rule_fertilizer = CROP_BASED_FERTILIZER.get(crop)

    # 2️⃣ ML-based prediction (secondary)
    try:
        crop_encoded = crop_encoder.transform([crop])[0]
        ml_prediction = model.predict([[N, P, K, crop_encoded]])[0]
        ml_fertilizer = fertilizer_encoder.inverse_transform([ml_prediction])[0]
    except Exception:
        ml_fertilizer = None

    # 3️⃣ Final decision
    final_fertilizer = rule_fertilizer or ml_fertilizer or "NPK"

    return final_fertilizer
