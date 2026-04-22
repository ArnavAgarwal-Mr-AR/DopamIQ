import requests
import json

url = "http://localhost:8000/api/llm/simulate"
payload = {
    "scenario": {
        "time": "Monday 11 PM",
        "device": "laptop"
    }
}

try:
    # We might need a mock user dependency if it's protected, 
    # but the logs show uvicorn running at 8000 usually.
    # If this fails, I'll know why.
    response = requests.post(url, json=payload, timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Data: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
