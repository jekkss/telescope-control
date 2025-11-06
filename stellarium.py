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
            'latitude' : '',
            'longitude' : '',
            'status': 404
        }
    else:
        data =  StellariumResponse.text
        data_json = json.loads(data)
        selectioninfo = data_json['selectioninfo']
        
        bodyTag = selectioninfo.find('HA/Dec:')  # "HA/Dec: Ч.У./Скл.:"
        selectionObjectInfo = selectioninfo[:bodyTag]

        selectioninfo = selectioninfo[bodyTag + 7:]
        selectioninfo = selectioninfo.lstrip(' ')
        selectioninfoAltAz = selectioninfo
        # Дальнейшая обработка selectioninfo
        bodyTag = selectioninfo.find(" ")
        selectioninfo = selectioninfo[:bodyTag]
        selectioninfo = selectioninfo.strip()
        
        
        bodyTag = selectioninfoAltAz.find('Az./Alt.:')
        selectioninfoAltAz = selectioninfoAltAz[bodyTag + 11:]
        selectioninfoAltAz = selectioninfoAltAz.lstrip(' ')
        bodyTag = selectioninfoAltAz.find(" ")
        selectioninfoAltAz = selectioninfoAltAz[:bodyTag]
        selectioninfoAltAz = selectioninfoAltAz.strip()

        selectioninfoAltAz = selectioninfoAltAz.replace('°', '*', 2)
        selectioninfoAltAz = selectioninfoAltAz.replace('\'', ':', 2)
        bodyTag = selectioninfoAltAz.find("/")
        Az = selectioninfoAltAz[:bodyTag-3]
        Alt = selectioninfoAltAz[bodyTag+1:-3]
        
        if selectioninfo.find('h') == 1:
            selectioninfo = '0' + selectioninfo

        if selectioninfo.find('°') == 15:
            selectioninfo = selectioninfo[:14] + '0' + selectioninfo[14:]

        if not selectioninfo:
            array = {
                'info': 'Stellarium connected! The object is not selected!',
                'coordinates': '',
                'Az': '',
                'Alt': '',
                'latitude' : '',
                'longitude' : '',
                'status': 500
            }
        else:
            #selectionObjectInfo += selectioninfo
            
            array = {
                'coordinates': selectioninfo,
                'info': selectionObjectInfo,
                'Az': Az,
                'Alt': Alt,
                'latitude' : data_json['location']['latitude'],
                'longitude' : data_json['location']['longitude'],
                'status': 200
            }
    return array