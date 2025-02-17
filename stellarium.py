import requests
import json

def stellariumConnect():
    url = 'http://localhost:8090/api/main/status'

    try:
        StellariumResponse = requests.get(url)
    except requests.ConnectionError:
        array = {
            'coordinates': '',
            'info': 'Stellarium is not connected!',
            'status': 404
        }
    else:
        data =  StellariumResponse.text
        data_json = json.loads(data)
        selectioninfo = data_json['selectioninfo']
        bodyTag = selectioninfo.find('HA/Dec:')  # "Ч.У./Скл.:"
        selectionObjectInfo = selectioninfo[:bodyTag]
        
        selectioninfo = selectioninfo[bodyTag + 7:]
        selectioninfo = selectioninfo.lstrip(' ')

        # Дальнейшая обработка selectioninfo
        bodyTag = selectioninfo.find(" ")
        selectioninfo = selectioninfo[:bodyTag]
        selectioninfo = selectioninfo.strip()
        
        if selectioninfo.find('h') == 1:
            selectioninfo = '0' + selectioninfo

        if selectioninfo.find('°') == 15:
            selectioninfo = selectioninfo[:14] + '0' + selectioninfo[14:]

        if not selectioninfo:
            array = {
                'info': 'Stellarium connected! The object is not selected!',
                'coordinates': '',
                'status': 500
            }
        else:
            #selectionObjectInfo += selectioninfo
            
            array = {
                'coordinates': selectioninfo,
                'info': selectionObjectInfo,
                'status': 200
            }

    return array