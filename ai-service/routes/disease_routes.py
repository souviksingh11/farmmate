from flask import Blueprint, request, jsonify
import tensorflow as tf
import numpy as np
import cv2
import json
import os

disease_bp = Blueprint("disease_bp", __name__)

# ======================
# LOAD MODEL (only once)
# ======================
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "plant_disease_model.h5")
model = tf.keras.models.load_model(MODEL_PATH)

# Load class names
CLASS_PATH = os.path.join(os.path.dirname(__file__), "..", "class_names.json")
with open(CLASS_PATH) as f:
    class_indices = json.load(f)

class_names = list(class_indices.keys())

IMG_SIZE = 224

# ======================
# ROUTE
# ======================
@disease_bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    image_data = data.get("image")

    # Remove base64 prefix
    header, encoded = image_data.split(",", 1)

    import base64
    import numpy as np
    import cv2

    img_bytes = base64.b64decode(encoded)
    img_array = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)
    class_index = int(np.argmax(prediction))

    disease_name = class_names[class_index]
    confidence = float(np.max(prediction))

    return jsonify({
        "disease": disease_name,
        "confidence": confidence
    })

