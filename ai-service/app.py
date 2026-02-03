from flask import Flask
from flask_cors import CORS
from routes.disease_routes import disease_bp
from routes.fertilizer_routes import fertilizer_bp
import os

app = Flask(__name__)
CORS(app)

app.register_blueprint(disease_bp)
app.register_blueprint(fertilizer_bp)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
