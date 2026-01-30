from flask import Blueprint, request, jsonify
import os
from services.disease_service import predict_disease

disease_bp = Blueprint("disease", __name__)

UPLOAD_FOLDER = "uploads/leaf_images"

@disease_bp.route("/api/detect-disease", methods=["POST"])
def detect_disease():
    image = request.files["image"]
    path = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(path)

    disease, confidence = predict_disease(path)

    return jsonify({
        "disease": disease,
        "confidence": confidence,
        "solution": "Use recommended pesticide"
    })
