# Recipe Voice Assistant

A simple web application that fetches recipe instructions and reads them out loud step-by-step.

## Features
- **Recipe Fetching**: Retrieves instructions for a given Recipe ID from the Foodoscope API.
- **Voice Assistant**: Reads out instructions using the browser's Text-to-Speech (TTS) capabilities.
- **Step Navigation**: Go to next/previous step or pause/resume speech.

## Prerequisites
- Python 3.x
- `pip` (Python package installer)

## Setup Instructions

1.  **Clone or Download the Repository**:
    Ensure you have the project files (`app.py`, `templates/index.html`, `README.md`) in a directory.

2.  **Install Dependencies**:
    Open a terminal/command prompt in the project directory and run:
    ```bash
    pip install flask requests
    ```

3.  **Run the Application**:
    Execute the following command:
    ```bash
    python app.py
    ```

4.  **Access the App**:
    Open your web browser and go to:
    [http://127.0.0.1:5000](http://127.0.0.1:5000)

## Usage

1.  Enter a valid **Recipe ID** (e.g., `2615`) in the input box.
2.  Click **Start Cooking**.
3.  The app will fetch the instructions and begin reading the first step.
4.  Use the controls to navigate between steps or pause the voice.

## API Key Note
The application uses a hardcoded API token for demonstration purposes. In a production environment, this should be managed via environment variables.
