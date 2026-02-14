# Food Identification App

## Overview
A simple Flask web application that identifies food from user-uploaded images using Google's Gemini 1.5 Flash model.

## Prerequisites
- Python 3.8+
- Google Cloud API Key for Gemini

## Setup Instructions

### 1. Install Dependencies
Open your terminal or command prompt in the project folder and run:
```bash
pip install -r requirements.txt
```

### 2. Get Your API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Create API key**.
4. Copy the generated API key.

### 3. Configure the App
1. Open the `.env` file in this folder.
2. Replace `your_api_key_here` with your actual API key.
   Example:
   ```
   GEMINI_API_KEY=AIzaSyD...
   ```
3. Save the file.

### 4. Run the Application
Run the following command in your terminal:
```bash
python app.py
```

### 5. Use the App
1. Open your web browser and go to `http://127.0.0.1:5000`.
2. Click the "Choose a food image" area to select a photo.
3. Click "Identify Food".
4. The AI will detect and display the name of the dish.

## Files Structure
- `app.py`: The main Flask backend code.
- `templates/index.html`: The frontend user interface.
- `requirements.txt`: List of required Python libraries.
- `.env`: Configuration file for your API key.
