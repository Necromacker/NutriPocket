import requests
import sys

try:
    print("Testing backend API...")
    response = requests.get("http://127.0.0.1:5002/api/instructions/2615")
    if response.status_code == 200:
        data = response.json()
        print("Success! Backend is reachable and returned data.")
        # print("Response preview:", str(data)[:200])
        # Check if instructions are present
        if isinstance(data, list) and len(data) > 0:
             print("Instructions found in response.")
        elif isinstance(data, dict) and ('instructions' in data or 'steps' in data):
             print("Instructions key found in response.")
        else:
             print("Warning: Response format might be unexpected but is valid JSON.")
    else:
        print(f"Failed: Status code {response.status_code}")
        print(response.text)
        sys.exit(1)
except Exception as e:
    print(f"Error connecting to backend: {e}")
    sys.exit(1)
