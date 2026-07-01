import serial
import serial.tools.list_ports
import json
import time

telescopeComPort = None
focuserComPort = None

def serialPorts():
    ports = serial.tools.list_ports.comports()
    portList = []
    for port in ports:
        portList.append(port.device)
    return portList

def serialOpen(data, device):
    global telescopeComPort
    global focuserComPort

    port = data.decode('utf-8').replace('"', '')
    #print(port)

    # Close a previously opened handle before reconnecting.
    existing = telescopeComPort if device == "telescope" else focuserComPort
    if existing is not None:
        try:
            existing.close()
        except (serial.SerialException, OSError) as error:
            print(f"Error closing {device} port: {error}")

    try:
        # timeout so a partial line never blocks the reader indefinitely
        connection = serial.Serial(port, 115200, timeout=1)
    except (serial.SerialException, ValueError, OSError) as error:
        print(f"Error opening {device} port {port}: {error}")
        # Reset the handle so the next attempt starts from a clean state.
        if device == "telescope":
            telescopeComPort = None
        else:
            focuserComPort = None
        return "Disconnected"

    if device == "telescope":
        telescopeComPort = connection
    else:
        focuserComPort = connection

    return "Connected" if connection.is_open else "Disconnected"

def serialTelescopeOpen(data):
    return serialOpen(data, "telescope")

def serialFocuserOpen(data):
    return serialOpen(data, "focuser")

def serialTelescopeClose(data):
    global telescopeComPort
    port = data.decode('utf-8').replace('"', '')
    
    if(telescopeComPort != None):
        telescopeComPort.close()
        return "Disconnected"
    
def serialFocuserClose(data):
    global focuserComPort
    port = data.decode('utf-8').replace('"', '')
    
    if(focuserComPort != None):
        focuserComPort.close()
        return "Disconnected"

def serialTelescopeWrite(data):
    global telescopeComPort
    if(telescopeComPort != None):
        telescopeComPort.write(data)
        telescopeComPort.write(b'\n')
        print(data)
    
def serialFocuserWrite(data):
    global focuserComPort
    if(focuserComPort != None):
        focuserComPort.write(data)
        focuserComPort.write(b'\n')
        print(data)
        
def readTelescopeLine():
    """Return one buffered line from the telescope port, or None if nothing is waiting.

    Used by the WebSocket reader task, so it stays cheap: no disk writes, no
    JSON parsing (the raw line is forwarded to the browser as-is).
    """
    global telescopeComPort
    if telescopeComPort is None:
        return None
    try:
        if telescopeComPort.in_waiting > 0:
            line = telescopeComPort.readline().decode(errors="replace").strip()
            return line or None
    except (serial.SerialException, OSError) as error:
        print(f"Error reading telescope port: {error}")
    return None
     
def serialFocuserRead():
    global focuserComPort
    json_data = 0
    if(focuserComPort != None):
        if focuserComPort.in_waiting > 0: 
            data = focuserComPort.readline().decode()
            json_data = json.loads(data) 

    return json_data
     

