import os
import json
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
import io

# Load environment variables
load_dotenv()

app = Flask(__name__)

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
        Identify the food in this image. 
        I have a database of recipes with the following titles: {titles_str}
        
        Analyze the image and described the food.
        Then, check if this food matches any of the recipe titles I provided. 
        If it matches (even if the name is slightly different but refers to the same dish), provide the exact 'matched_recipe_title' from my list.
        If there is no match in my list, set 'matched_recipe_title' to null.

        Return the result as a JSON object with the following keys:
        - identified_food: The common name of the food you identified.
        - description: A short description of the food.
        - matched_recipe_title: The exact title from my list that matches, or null.
        
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
                
                # If there's a match, find the nutrition data
                nutrition_info = None
                if result.get('matched_recipe_title'):
                    for item in NUTRITION_DATA:
                        if item.get('recipeTitle') == result['matched_recipe_title']:
                            nutrition_info = item
                            break
                
                result['nutrition_info'] = nutrition_info
                return jsonify(result)

            except json.JSONDecodeError:
                # Fallback if specific JSON parsing fails, just return plain text structure or error
                return jsonify({'food_name': cleaned_text, 'description': 'Could not parse detailed info', 'nutrition_info': None})
        else:
             return jsonify({'error': 'Could not identify food'}), 500

    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
