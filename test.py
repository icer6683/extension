import requests
import json

BASE = "http://127.0.0.1:5000/"
response = requests.put(BASE + "test")
print(response.json())
