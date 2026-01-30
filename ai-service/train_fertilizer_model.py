import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Load dataset
data = pd.read_csv("data/fertilizer_dataset.csv")

# Encode categorical columns
crop_encoder = LabelEncoder()
fertilizer_encoder = LabelEncoder()

data["Crop"] = crop_encoder.fit_transform(data["Crop"])
data["Fertilizer"] = fertilizer_encoder.fit_transform(data["Fertilizer"])

# Features and target
X = data[["N", "P", "K", "Crop"]]
y = data["Fertilizer"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)
model.fit(X_train, y_train)

# Ensure models folder exists
os.makedirs("models", exist_ok=True)

# Save model and encoders
joblib.dump(model, "models/fertilizer_model.pkl")
joblib.dump(crop_encoder, "models/crop_encoder.pkl")
joblib.dump(fertilizer_encoder, "models/fertilizer_encoder.pkl")

print("✅ Fertilizer ML model trained and saved successfully")
