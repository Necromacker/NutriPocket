import os
from flask import Flask, render_template, jsonify, request
import requests
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS for frontend requests

# Constants
API_BASE_URL = "https://api.foodoscope.com/recipe2-api/instructions/"
API_TOKEN = "Bearer X-rU-MJr4BiA64g2PnbvlJp3Ek4HvW1QKniooxvk9sX-l6u0"

# Local recipes for custom dishes
LOCAL_RECIPES = {
    9001: {
        "recipe_id": 9001,
        "recipe_title": "Tofu Burger",
        "instructions": [
            "Press the tofu block between paper towels for 15 minutes to remove excess moisture. This helps achieve a better texture.",
            "Slice the pressed tofu into 4 equal rectangular patties, about half an inch thick.",
            "In a shallow bowl, mix together 2 tablespoons soy sauce, 1 tablespoon olive oil, 1 teaspoon garlic powder, 1 teaspoon smoked paprika, and half teaspoon black pepper.",
            "Marinate the tofu patties in this mixture for at least 10 minutes, flipping once to coat both sides evenly.",
            "Heat a non-stick pan or grill over medium-high heat and add a drizzle of oil.",
            "Place the marinated tofu patties on the hot pan and cook for 4 to 5 minutes on the first side until golden brown and slightly crispy.",
            "Flip the patties carefully using a spatula and cook for another 4 to 5 minutes on the other side.",
            "While the tofu cooks, lightly toast your burger buns in the same pan or in a toaster until golden.",
            "Prepare your toppings: slice tomatoes, wash lettuce leaves, slice red onion, and prepare any sauces like vegan mayo or mustard.",
            "Assemble the burger by placing lettuce on the bottom bun, then the tofu patty, followed by tomato slices, onion, pickles, and your choice of sauce.",
            "Top with the other half of the bun and serve immediately while hot. Enjoy your delicious tofu burger with a side of sweet potato fries or salad!"
        ]
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/instructions/<int:recipe_id>')
def get_instructions(recipe_id):
    # Check if this is a local recipe first
    if recipe_id in LOCAL_RECIPES:
        return jsonify(LOCAL_RECIPES[recipe_id])
    
    # Otherwise, fetch from external API
    url = f"{API_BASE_URL}{recipe_id}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": API_TOKEN,
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status() 
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
