import os
import json
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
import io
import requests

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Simplified CORS setup
CORS(app)

# Configure Gemini API
GOOGLE_API_KEY = os.getenv('GEMINI_API_KEY')
if not GOOGLE_API_KEY:
    print("Warning: GEMINI_API_KEY not found in .env file")

# Configure genai with the API key
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# Use Gemini Flash Latest model (Stable)
model = genai.GenerativeModel('gemini-flash-latest')

# Load nutrition data
NUTRITION_DATA = []
try:
    with open('nutrition.json', 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
        # Check if data is wrapped in payload/data structure
        if isinstance(raw_data, dict) and 'payload' in raw_data and 'data' in raw_data['payload']:
             NUTRITION_DATA = raw_data['payload']['data']
        elif isinstance(raw_data, list):
             NUTRITION_DATA = raw_data
        else:
             print("Warning: aggregated nutrition.json structure unknown. Expecting list or payload.data")
             
    print(f"Loaded {len(NUTRITION_DATA)} recipes from nutrition.json")
except FileNotFoundError:
    print("nutrition.json not found. Nutrition matching will be disabled.")
except json.JSONDecodeError:
    print("Error decoding nutrition.json. Check file format.")

def get_recipe_titles():
    return [item.get('recipeTitle') for item in NUTRITION_DATA if isinstance(item, dict) and item.get('recipeTitle')]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/identify', methods=['POST'])
def identify_food():
    if not GOOGLE_API_KEY:
         return jsonify({'error': 'GEMINI_API_KEY not configured in .env file'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Read image
        img_bytes = file.read()
        image = Image.open(io.BytesIO(img_bytes))

        # Get recipe titles for fuzzy matching
        recipe_titles = get_recipe_titles()
        titles_str = ", ".join(recipe_titles)

        # Prepare prompt
        prompt = f"""
        Identify the food in this image and write a short description of it.
        
        I have a database of recipes with the following titles: {titles_str}
        
        Compare your description of the specific food in the image with my list of recipe titles.
        
        Rules for matching:
        1. Look for an exact match first.
        2. If no exact match, look for a "closest match" based on the MAIN INGREDIENT or DISH TYPE.
           - Example: If you see "Plain Rice" and my list has "Egyptian Rice with Vermicelli", MATCH IT.
           - Example: If you see "Grilled Chicken" and my list has "Chicken Panne" or "Roasted Chicken", MATCH IT.
           - Example: If you see "Beef Stew" and my list has "Egyptian Meat Stew", MATCH IT.
        3. Your goal is to find the *best available nutrition data source* from my list, even if it's not the exact same variation.
        
        If you find a matching (or similar) recipe in my list, provide the EXACT 'matched_recipe_title' from my list.
        Only set 'matched_recipe_title' to null if the food is completely unrelated to anything in my list.
        
        Regardless of matching, please estimate:
        1. The nutritional content for one serving (Calories, Protein, Fat, Carbs).
        2. A breakdown of likely ingredients with approximate quantities.
        3. Key micronutrients present.

        Return the result as a JSON object with the following keys:
        - identified_food: The common name.
        - description: Short description.
        - matched_recipe_title: The exact title from my list that matches, or null.
        - estimated_macros: {{ "calories": numeric, "protein": numeric_g, "fat": numeric_g, "carbs": numeric_g }}
        - estimated_ingredients: [ {{ "name": string, "quantity": string, "cals": numeric, "p": string_protein_g }} ]
        - micronutrients: [ string, string ] (e.g. "Vitamin A", "Iron")
        - health_insight: One sentence insight.
        
        Return ONLY the JSON. Do not add any other text or markdown formatting.
        """

        # Generate content
        response = model.generate_content([prompt, image])
        
        # Extract and parse text
        if response.text:
            cleaned_text = response.text.strip()
            # Remove markdown code blocks if present
            if cleaned_text.startswith("```json"):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-3]
            
            try:
                result = json.loads(cleaned_text)
                print(f"DEBUG: Gemini Identified: {result.get('identified_food')}")
                print(f"DEBUG: Gemini Matched With: {result.get('matched_recipe_title')}")

                # If there's a match, find the nutrition data from DB
                matched_data = None
                
                if result.get('matched_recipe_title'):
                    for item in NUTRITION_DATA:
                        if item.get('recipeTitle') == result['matched_recipe_title']:
                            matched_data = item
                            break
                
                # Determine Macros Source
                final_macros = {}
                data_source_note = ""
                
                if matched_data:
                    # Use DB Macros
                    final_macros = {
                        'calories': float(matched_data.get('Calories', 0)),
                        'protein': float(matched_data.get('Protein (g)', 0)),
                        'fat': float(matched_data.get('Total lipid (fat) (g)', 0)),
                        'carbs': float(matched_data.get('Carbohydrate, by difference (g)', 0))
                    }
                    data_source_note = f" (Verified data for: {result['matched_recipe_title']})"
                else:
                    # Use Gemini Estimated Macros
                    est = result.get('estimated_macros', {})
                    final_macros = {
                        'calories': est.get('calories', 0),
                        'protein': est.get('protein', 0),
                        'fat': est.get('fat', 0),
                        'carbs': est.get('carbs', 0)
                    }
                    data_source_note = " (AI Estimated)"

                # Construct response
                response_data = {
                    'identified_food': result.get('identified_food', 'Unknown Food'),
                    'description': result.get('description', '') + data_source_note,
                    'matched_recipe_title': result.get('matched_recipe_title'),
                    'macros': final_macros,
                    'ingredients': result.get('estimated_ingredients', []),
                    'micronutrients': result.get('micronutrients', []),
                    'health_score': 85, 
                    'health_insight': result.get('health_insight', 'Balanced choice.')
                }
                
                return jsonify(response_data)

            except json.JSONDecodeError:
                return jsonify({'error': 'Failed to parse API response', 'raw': cleaned_text}), 500
            except Exception as e:
                 return jsonify({'error': f'Error processing data: {str(e)}'}), 500
        else:
             return jsonify({'error': 'Could not identify food'}), 500



    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500


# -------------------------------------------------------------------
# Cook With Us API Integration
# -------------------------------------------------------------------
API_BASE_URL = "https://api.foodoscope.com/recipe2-api/instructions/"
API_TOKEN = "Bearer gCsX2sONi5bENi4_KFazz0jr7APGxJNl1DNHrSubNN0JpPHG"

@app.route('/api/instructions/<int:recipe_id>')
def get_instructions(recipe_id):
    url = f"{API_BASE_URL}{recipe_id}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": API_TOKEN,
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status() 
        return jsonify(response.json())
    except Exception as e:
        # Fallback for demo if API fails (e.g. Rate Limit)
        if recipe_id == 2615:
            return jsonify({
                "instructions": [
                    "Place chicken, onion, carrot, celery into a large pot and cover with water.",
                    "Add bay leaf, peppercorns, and salt. Bring to a boil.",
                    "Reduce heat to low and simmer for 45-60 minutes.",
                    "Skim off any foam that rises to the surface.",
                    "Remove chicken and strain the broth through a fine sieve.",
                    "Serve hot or use as a base for soups."
                ]
            })
        
        status_code = 500
        if hasattr(e, 'response') and e.response:
             status_code = e.response.status_code
        return jsonify({"error": str(e)}), status_code

if __name__ == '__main__':
    app.run(debug=True, port=5002)
