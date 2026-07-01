import asyncio

from sanic import Sanic, response
from stellarium import stellariumConnect
from settings import readSettings, writeSettings
from comPort import serialPorts, serialTelescopeWrite, serialTelescopeOpen, serialTelescopeClose, readTelescopeLine, serialFocuserOpen, serialFocuserClose
from appAscomSocketCelestron import socketOpen, socketWrite, socketRead

#import socket
#host = socket.getaddrinfo(socket.gethostname(), None)
#ipv4_addresses = [i[4][0] for i in host if i[0] == socket.AF_INET]
#print(ipv4_addresses) 

app = Sanic(__name__)
app.static('/static/', './static/')

@app.route('/')
async def index_page(request):
    return await response.file('index.html')

@app.route('/stellarium')
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

@app.route('/serialTelescopeOpen', methods=["POST"])
def sTOpen(request):
    return response.json(serialTelescopeOpen(request.body))

@app.route('/serialTelescopeClose', methods=["POST"])
def sTClose(request):
    return response.json(serialTelescopeClose(request.body))

@app.route('/serialFocuserOpen', methods=["POST"])
def sFOpen(request):
    return response.json(serialFocuserOpen(request.body))

@app.route('/serialFocuserClose', methods=["POST"])
def sFClose(request):
    return response.json(serialFocuserClose(request.body))

@app.route('/socketOpen', methods=["POST"])
def soOpen(request):
    return response.json(socketOpen(request.body))

@app.route('/socketWrite', methods=["POST"])
def soWrite(request):
    return response.json(socketWrite(request.body))

@app.route('/socketRead', methods=["POST"])
def soRead(request):
    return response.json(socketRead(request.body))

# --- Telescope telemetry over WebSocket ---------------------------------
# A single background task reads the serial port and pushes each line to all
# connected browsers, replacing the old 100 ms HTTP polling loop.

telescope_ws_clients = set()

@app.websocket('/ws/telescope')
async def telescope_ws(request, ws):
    telescope_ws_clients.add(ws)
    try:
        # Keep the connection open; the browser is a passive listener.
        async for _ in ws:
            pass
    finally:
        telescope_ws_clients.discard(ws)

async def telescope_reader():
    loop = asyncio.get_event_loop()
    while True:
        # Run the blocking pyserial read off the event loop.
        line = await loop.run_in_executor(None, readTelescopeLine)
        if line and telescope_ws_clients:
            for ws in list(telescope_ws_clients):
                try:
                    await ws.send(line)
                except Exception:
                    telescope_ws_clients.discard(ws)
        elif not line:
            await asyncio.sleep(0.05)

@app.before_server_start
async def start_background_tasks(app, loop):
    app.add_task(telescope_reader())

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=1337, debug=False, access_log=False)