from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)

# Constants
API_BASE_URL = "https://api.foodoscope.com/recipe2-api/instructions/"
API_TOKEN = "Bearer gCsX2sONi5bENi4_KFazz0jr7APGxJNl1DNHrSubNN0JpPHG"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/instructions/<int:recipe_id>')
def get_instructions(recipe_id):
    url = f"{API_BASE_URL}{recipe_id}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": API_TOKEN,
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status() # Raise an exception for bad status codes
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
