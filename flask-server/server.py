import uuid
from flask import Flask, session, jsonify, request
from flask_cors import CORS
from solver.solver import Solver  # Import the Solver class
import os
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "supersecretkey"

# Load data for the solver
file_path = os.path.join(os.path.dirname(__file__), "solver", "data.json")
try:
    with open(file_path, "r") as file:
        data = json.load(file)
except FileNotFoundError:
    print(f"File not found: {file_path}")
    data = {}

# Dictionary to store Solver instances
solvers = {}

# Session POST endpoint
@app.route("/session", methods=["POST"])
def create_session():
    session_id = str(uuid.uuid4())
    session['id'] = session_id #FIX THIS
    solvers[session_id] = Solver(data)  # Store the Solver instance in the dictionary
    print(solvers)
    print(f"Session created: {session_id}")
    print(f"Number of sessions: {len(solvers)}")
    return jsonify({"id": session_id})

# Delete session POST endpoint
# TODO make sure session ID is passed thru (it is not currently)
@app.route("/deletesession", methods=["POST"])
def delete_session():
    json_data = request.get_json()
    session_id = json_data.get('session_id')

    if session_id in solvers:
        del solvers[session_id]
    session.clear()

    print(f"Session deleted: {session_id}")
    print(f"Number of sessions: {len(solvers)}")
    return jsonify({"status": "success"}), 200

# Handle word POST endpoint
#TODO make handleword within the solver change the turn instead of it being in the game loop in the original
# TODO maybe make a function that handles a turn as opposed to a word
# TODO make it not check for new words every time
@app.route("/handleword", methods=["POST"])
def handle_word():
    json_data = request.get_json()
    session_id = json_data.get('session_id')
    print(f"Received session_id: {session_id}")
    solver = solvers.get(session_id)
    if not solver:
        print(f"Session not found for session_id: {session_id}")
        return jsonify({"error": "Session not found"}), 404

    word = json_data.get("word")
    colors = json_data.get("colors")
    print(f"handling: {word}, {colors}")
    solver.handle_word(word, colors)
    print(f"Green letters {len(solver.green_letters)}")
    print(f"yellow letters {len(solver.yellow_letters)}")
    print(f"gray letters {len(solver.grey_letters)}")

    solver.possible_words = solver.get_valid_words()
    solver.turn += 1
    solver.prune_words()
    solver.weight_words()

    return jsonify({"status": "success"}), 200

@app.route('/recommended_word', methods=['POST'])
def recommended_word():
    json_data = request.get_json()
    print(json_data)
    print(solvers)
    session_id = json_data.get('session_id')
    if session_id in solvers:
        print(f"Rec session found")
        recommended_word = solvers[session_id].recommend_word()
        print(f"Rec word: {recommended_word}")
        return jsonify({"recommended_word": recommended_word})
    else:
        return jsonify({"error": "Invalid session_id"}), 400
    
@app.route('/word_count', methods=['POST'])
def word_count():
    json_data = request.get_json()
    session_id = json_data.get('session_id')
    if session_id in solvers:
        print(f"WC session found")
        print(len(solvers[session_id].possible_words))
        return jsonify({"len_words": len(solvers[session_id].possible_words)}), 200
    else:
        return jsonify({"error": "Invalid session_id"}), 400

@app.route('/possible_words', methods=['POST'])
def possible_words():
    json_data = request.get_json()
    session_id = json_data.get('session_id')
    if session_id in solvers:
        print(f"PW session found")
        possible_words = solvers[session_id].possible_words
        print(f"Possible words: {possible_words}")
        return jsonify({"possible_words": possible_words}), 200
    else:
        return jsonify({"error": "Invalid session_id"}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Ensure the backend runs on port 5000
