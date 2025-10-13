from sanic import Sanic, response
from stellarium import stellariumConnect
from settings import readSettings, writeSettings
from comPort import serialPorts, serialTelescopeWrite, serialTelescopeOpen, serialTelescopeClose, serialTelescopeRead
from appAscomSocketCelestron import socketOpen, socketWrite, socketRead

import socket
host = socket.getaddrinfo(socket.gethostname(), None)
ipv4_addresses = [i[4][0] for i in host if i[0] == socket.AF_INET]
print(ipv4_addresses) 

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

@app.route('/serialTelescopeWrite', methods=["POST"])
def sWrite(request):
    return response.json(serialTelescopeWrite(request.body))

@app.route('/serialTelescopeRead')
async def sRead(request):
    return response.json(serialTelescopeRead())  

@app.route('/serialTelescopeOpen', methods=["POST"])
def sTOpen(request):
    return response.json(serialTelescopeOpen(request.body))

@app.route('/serialTelescopeClose', methods=["POST"])
def sTClose(request):
    return response.json(serialTelescopeClose(request.body))

@app.route('/socketOpen', methods=["POST"])
def soOpen(request):
    return response.json(socketOpen(request.body))

@app.route('/socketWrite', methods=["POST"])
def soWrite(request):
    return response.json(socketWrite(request.body))

@app.route('/socketRead', methods=["POST"])
def soRead(request):
    return response.json(socketRead(request.body))


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=1337, debug=False, access_log=False)