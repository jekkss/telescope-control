from sanic import Sanic, response
from stellarium import stellariumConnect
from settings import readSettings, writeSettings
from comPort import serialPorts, serialWrite, serialOpen
import serial

app = Sanic(__name__)
app.static('/static/', './static/')

@app.route('/')
async def index_page(request):
    return await response.file('index.html')

@app.route('/api')
async def api(request):
    return response.json(stellariumConnect())

@app.route('/readSettings')
async def readSet(request):
    return response.json(readSettings())   

@app.route('/writeSettings', methods=["POST"])
async def writeSet(request):
    return response.json(writeSettings(request.body))

@app.route('/serialPorts')
async def sPorts(request):
    return response.json(serialPorts()) 

@app.route('/serialWrite', methods=["POST"])
def sWrite(request):
    return response.json(serialWrite(request.body))

@app.route('/serialOpen', methods=["POST"])
def sOpen(request):
    return response.json(serialOpen(request.body))

if __name__ == '__main__':
    app.run()