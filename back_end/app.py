from flask import Flask, jsonify, request
from flask_cors import CORS
from db import DB


app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend
_db = DB()

@app.route("/api/get_sop", methods=["GET"])
def get_sop_name():
    sops_name = _db.get_sops()
    return jsonify(sops_name)

@app.route("/api/add_sop", methods=["POST"])
def add_sop():
    data = request.json
    sop_name = data['sop_name']
    _db.add_sop(sop_name)
    return jsonify({"status": "success", "received": data})

@app.route("/api/get_action", methods=["GET"])
def get_action():
    action_name = _db.get_actions()
    return jsonify(action_name)

@app.route("/api/delete_sop", methods=["DELETE"])
def delete_sop():
    data = request.json
    sop_name = data['sop_name']
    _db.delete_sop(sop_name)
    return jsonify({ "status": "delete success", "received": data})

@app.route("/api/get_all_step", methods=["POST"])  # Use POST if you're sending data in the body
def get_all_step():
    data = request.get_json()
    sop_name = data.get("sop_name")
    setup_type = data.get("setup_type")

    if not sop_name or not setup_type:
        return jsonify({"error": "Missing sop_name or setup_type"}), 400

    all_steps = _db.get_all_step(sop_name, setup_type)
    return jsonify(all_steps)

@app.route("/api/delete_step_order", methods=["DELETE"])  # Use POST if you're sending data in the body
def delete_step_order():
    data = request.get_json()
    stepOrder = data.get("stepOrder")
    setupId = data.get("setupId")

    if not stepOrder or not setupId:
        return jsonify({"error": "Missing step order or set up ID"}), 400

    _db.delete_step(stepOrder, setupId)
    return jsonify({ "status": "delete success", "received": data})

if __name__ == "__main__":
    app.run(debug=True)
    CORS(app)
