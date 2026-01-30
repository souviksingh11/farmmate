# from tensorflow.keras.models import load_model
# from utils.image_preprocessing import preprocess_image

# # model = load_model("models/disease_model.h5")
# model = None

# CLASSES = ["Healthy", "Leaf Blight", "Leaf Mold", "Yellow Curl"]

def predict_disease(image_path):
    # image = preprocess_image(image_path)
    # prediction = model.predict(image)

    # index = prediction.argmax()
    # disease = CLASSES[index]
    # confidence = float(prediction.max() * 100)

    # return disease, confidence
     return "Model not loaded", 0.0
