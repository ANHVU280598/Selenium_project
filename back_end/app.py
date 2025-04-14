from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

@app.route("/api/data", methods=["GET"])
def get_data():
    return jsonify({"message": "Hello from Flask!"})

@app.route("/api/sop", methods=["POST"])
def add_sop():
    data = request.json
    print("Received:", data)
    return jsonify({"status": "success", "received": data})

if __name__ == "__main__":
    app.run(debug=True)
