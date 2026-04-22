"""
PetMatch AI — Flask Backend Server

Provides the /api/chat endpoint for the pet recommendation chatbot.
Serves pet images from the frontend/images directory.
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from recommender import process_message
import os
import time

# ── App setup ───────────────────────────────────────────────────────────────

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Path to pet images directory (relative to project root)
IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "server", "images")


# ── API Routes ──────────────────────────────────────────────────────────────

@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Chat endpoint — processes user messages and returns pet recommendations.

    Request JSON:
        {
            "message": "I live in a small apartment...",
            "session": { ... }   // optional, tracks conversation state
        }

    Response JSON:
        {
            "reply": "Here are your recommendations...",
            "pets": [ ... ] or null,
            "session": { ... }
        }
    """
    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({"error": "Missing 'message' field in request body"}), 400

    user_message = data["message"].strip()
    session = data.get("session", None)

    if not user_message:
        return jsonify({"error": "Message cannot be empty"}), 400

    # Simulate a brief processing delay for natural feel (300-600ms)
    time.sleep(0.4)

    # Process the message through the recommendation engine
    result = process_message(user_message, session)

    return jsonify(result)


@app.route("/api/pets/images/<filename>")
def serve_pet_image(filename):
    """Serve pet images from the server/images directory."""
    return send_from_directory(IMAGES_DIR, filename)


@app.route("/api/health")
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "PetMatch AI"})


# ── Main ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("\n[*] PetMatch AI Backend Server")
    print("=" * 40)
    print(f"[DIR] Images directory: {IMAGES_DIR}")
    print(f"[WEB] Server running at: http://localhost:5000")
    print(f"[API] Chat endpoint:     POST http://localhost:5000/api/chat")
    print(f"[OK]  Health check:      GET  http://localhost:5000/api/health")
    print("=" * 40 + "\n")

    app.run(host="0.0.0.0", port=5000, debug=True)