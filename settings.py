import json

def readSettings():
    with open('settings.json', encoding='utf-8') as json_file:
        data = json.load(json_file)
        return data

def writeSettings(data):
    # data is the raw request body (bytes) containing a JSON object.
    # Parse it first so we store an actual object, not a JSON string.
    settings = json.loads(data.decode('utf-8'))
    with open('settings.json', 'w', encoding='utf-8') as f:
        json.dump(settings, f, ensure_ascii=False, indent=2)
    return settings
