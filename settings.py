import json

def readSettings():
    with open('settings.json') as json_file:
        data = json.load(json_file)
        return data

def writeSettings(data):
    with open('settings.json', 'w') as f: 
        json.dump(data.decode('utf8'), f) 
