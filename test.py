import requests
import json

BASE = "http://127.0.0.1:5000/"
response = requests.put(BASE + "stats", {"time": 10})
print(response.json())
