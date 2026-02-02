import joblib

# Load trained ML model and encoders
model = joblib.load("models/fertilizer_model.pkl")
crop_encoder = joblib.load("models/crop_encoder.pkl")
fertilizer_encoder = joblib.load("models/fertilizer_encoder.pkl")

# 🌱 Rule-based agriculture knowledge
CROP_BASED_FERTILIZER = CROP_BASED_FERTILIZER = {

    # 🌾 Cereals
    "Rice": "Nitrogen-rich fertilizer (Urea based)",
    "Wheat": "Diammonium Phosphate fertilizer",
    "Maize": "Balanced Nitrogen-Phosphorus-Potassium fertilizer",
    "Barley": "Phosphorus-rich fertilizer for root development",
    "Millet": "Balanced Nitrogen-Phosphorus-Potassium fertilizer",
    "Sorghum": "Balanced Nitrogen-Phosphorus-Potassium fertilizer",
    "Oats": "Phosphorus-rich fertilizer",

    # 🌱 Pulses
    "Pulses": "Single Super Phosphate fertilizer",
    "Lentil": "Single Super Phosphate fertilizer",
    "Chickpea": "Single Super Phosphate fertilizer",
    "Green Gram": "Single Super Phosphate fertilizer",
    "Black Gram": "Single Super Phosphate fertilizer",
    "Pigeon Pea": "Single Super Phosphate fertilizer",

    # 🌿 Oilseeds
    "Groundnut": "Single Super Phosphate fertilizer",
    "Mustard": "Diammonium Phosphate fertilizer",
    "Soybean": "Diammonium Phosphate fertilizer",
    "Sunflower": "Balanced Nitrogen-Phosphorus-Potassium fertilizer",
    "Sesame": "Phosphorus-rich fertilizer",
    "Castor": "Balanced Nitrogen-Phosphorus-Potassium fertilizer",

    # 🌾 Cash Crops
    "Cotton": "Balanced Nitrogen-Phosphorus-Potassium fertilizer",
    "Sugarcane": "Nitrogen-rich fertilizer (Urea based)",
    "Jute": "Nitrogen-rich fertilizer",
    "Tobacco": "Balanced Nitrogen-Phosphorus-Potassium fertilizer",

    # 🍅 Vegetables
    "Tomato": "Balanced Nitrogen-Phosphorus-Potassium fertilizer",
    "Potato": "Diammonium Phosphate fertilizer",
    "Onion": "Phosphorus-rich fertilizer for bulb growth",
    "Garlic": "Phosphorus-rich fertilizer for bulb growth",
    "Chilli": "Balanced fertilizer for flowering and fruiting",
    "Brinjal": "Balanced fertilizer for plant growth",
    "Cabbage": "Nitrogen-rich fertilizer for leafy growth",
    "Cauliflower": "Balanced fertilizer for head development",
    "Carrot": "Phosphorus-rich fertilizer for root growth",
    "Spinach": "Nitrogen-rich fertilizer for leafy growth",
    "Peas": "Single Super Phosphate fertilizer",
    "Okra": "Balanced fertilizer for flowering and fruiting",
    "Pumpkin": "Balanced fertilizer",
    "Bottle Gourd": "Balanced fertilizer",

    # 🍎 Fruits
    "Banana": "Nitrogen-rich fertilizer for rapid growth",
    "Mango": "Balanced fertilizer for flowering and fruit yield",
    "Apple": "Balanced fertilizer for fruit development",
    "Grapes": "Balanced fertilizer for better fruit quality",
    "Orange": "Balanced fertilizer for fruit growth",
    "Papaya": "Balanced fertilizer for continuous fruiting",
    "Pomegranate": "Balanced fertilizer",
    "Guava": "Balanced fertilizer",
    "Litchi": "Balanced fertilizer",

    # 🌴 Plantation Crops
    "Tea": "Balanced fertilizer for leaf production",
    "Coffee": "Balanced fertilizer for berry development",
    "Rubber": "Balanced fertilizer for latex production",
    "Coconut": "Balanced fertilizer for nut development",
    "Arecanut": "Balanced fertilizer",

    # 🌿 Spices
    "Turmeric": "Phosphorus-rich fertilizer for rhizome growth",
    "Ginger": "Phosphorus-rich fertilizer for rhizome growth",
    "Coriander": "Single Super Phosphate fertilizer",
    "Cumin": "Single Super Phosphate fertilizer",
    "Black Pepper": "Balanced fertilizer",
    "Cardamom": "Balanced fertilizer",

    # Default
    "Unknown": "Balanced Nitrogen-Phosphorus-Potassium fertilizer"
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
