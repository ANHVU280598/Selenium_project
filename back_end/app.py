from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger
from db import DB
from runCode import RunCode
from threading import Thread, Event
import threading
import signal
import sys
from werkzeug.serving import make_server
import socket
import sys

if len(sys.argv) < 2:
    print("Usage: python app.py <db_path>")
    sys.exit(1)

db_path = sys.argv[1]

app = Flask(__name__)
swagger = Swagger(app, template_file='swagger/full_api.yml')
CORS(app)  # Enable CORS for React frontend
_db = DB(db_path)


# Handle shutdown signals
def graceful_exit(sig, frame):
    sys.exit(0)

signal.signal(signal.SIGINT, graceful_exit)   # Ctrl+C
signal.signal(signal.SIGTERM, graceful_exit)  # taskkill /PID /F

backend_process = None
active_threads = None
stop_flag = False

def check_stop_flag():
    return stop_flag

@app.route("/api/get_sop", methods=["GET"])
def get_sop_name():
    sops_name = _db.get_sops()
    return jsonify(sops_name)

@app.route("/api/run_code", methods=["POST"])
def run_code():
    global active_thread, stop_flag
    data = request.get_json()
    sop_name = data.get("sop_name")
    setup_type = data.get("setup_type")
    if not sop_name or not setup_type:
        return jsonify({"error": "Missing sop_name or setup_type"}), 400

    all_steps = _db.get_all_step(sop_name, setup_type)
    stop_flag = False

    def task_wrapper(steps):
        run = RunCode(stop_flag_ref=check_stop_flag)
        run.start(steps)

    active_thread = Thread(target=task_wrapper, args=(all_steps,))
    active_thread.daemon = True
    active_thread.start()

    return jsonify({"status": "success", "received": data})

@app.route("/api/stop_code", methods=["GET"])
def stop_code():
    global stop_flag
    stop_flag = True
    return jsonify({"status": "stop requested"})


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

@app.route("/api/add_sop", methods=["POST"])
def add_sop():
    data = request.json
    sop_name = data['sop_name']
    _db.add_sop(sop_name)
    return jsonify({"status": "success", "received": data})

@app.route("/api/add_action", methods=["POST"])
def add_action():
    data = request.json
    actionName = data['actionName']
    _db.add_action(actionName)
    return jsonify({"status": "success", "received": data})

@app.route("/api/add_step", methods=["POST"])
def add_step():
    data = request.json
    sop_name = data['sop_name']
    setUpType = data['setUpType']
    actionName = data['actionName']
    xPath = data['xPath']
    text = data['text']
    folder_path = data['folder_path']
    file_name = data['file_name']
    _db.add_step(sop_name, setUpType, actionName, xPath, text, folder_path, file_name)
    return jsonify({"status": "success", "received": data})

@app.route("/api/update_step_value", methods=["POST"])
def update_step_value():
    data = request.json
    print(data)
    required_fields = ['stepId']
    # Validate required fields
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    stepId = data['stepId']
    xpath = data.get('xPath')
    text = data.get('text')
    folder_path = data.get('folder_path')
    file_name = data.get('file_name')
    actionName = data.get('actionName')
    result = _db.update_step_value(
        stepId=stepId,
        actionName=actionName,
        xpath=xpath,
        text=text,
        folder_path=folder_path,
        file_name=file_name
    )
    return jsonify({"message": result})

@app.route("/api/get_all_step", methods=["POST"])  # Use POST if you're sending data in the body
def get_all_step():
    data = request.get_json()
    sop_name = data.get("sop_name")
    setup_type = data.get("setup_type")

    if not sop_name or not setup_type:
        return jsonify({"error": "Missing sop_name or setup_type"}), 400

    all_steps = _db.get_all_step(sop_name, setup_type)
    return jsonify(all_steps)

@app.route("/api/delete_step_order", methods=["DELETE"]) 
def delete_step_order():
    data = request.get_json()
    print(data)
    stepOrder = data.get("stepOrder")
    setupId = data.get("setUpId")

    if not stepOrder or not setupId:
        return jsonify({"error": "Missing step order or set up ID"}), 400

    _db.delete_step(stepOrder, setupId)
    return jsonify({ "status": "delete success", "received": data})

if __name__ == "__main__":
    host = '127.0.0.1'
    port = 5000

    http_server = make_server(host, port, app)
    http_server.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    print(f"Starting Flask server at http://{host}:{port}")
    try:
        http_server.serve_forever()
    except KeyboardInterrupt:
        print("Shutting down server.")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        http_server.server_close()
        print("Socket closed.")
        sys.exit(0)
