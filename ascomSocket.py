import requests
import json

def ascomWrite():
    user_data = {'name': 'John', 'email': 'john@example.com'}  
     

    try:
        response = requests.post('https://api.example.com/users', json=user_data)
    except requests.ConnectionError:
        print("error")
    else:
        data =  response.text
        print(data)
    return data