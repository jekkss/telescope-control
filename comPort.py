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

def serialTelescopeOpen(data):
    print(data)
    global telescopeComPort
    port = data.decode('utf-8').replace('"', '')
    
    if(telescopeComPort != None):
        telescopeComPort.close()
        
        telescopeComPort = serial.Serial(port, 115200)
        
        if telescopeComPort.is_open:
           return "Connected" 
    else:
        try:
            telescopeComPort = serial.Serial(port, 115200) 
            return "Connected"
        except:
            return "Disconnected"
        
def serialFocuserOpen(data):
    global focuserComPort
    port = data.decode('utf-8').replace('"', '')
    
    if(focuserComPort != None):
        focuserComPort.close()
        
        focuserComPort = serial.Serial(port, 115200)
        
        if focuserComPort.is_open:
           return "Connected" 
    else:
        try:
            focuserComPort = serial.Serial(port, 115200) 
            return "Connected"
        except:
            return "Disconnected"
        
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
        
def serialTelescopeRead():
    global telescopeComPort
    json_data = 0
    if(telescopeComPort != None):
        if telescopeComPort.in_waiting > 0: 
            data = telescopeComPort.readline().decode()
            json_data = json.loads(data) 

    return json_data
     
def serialFocuserRead():
    global focuserComPort
    json_data = 0
    if(focuserComPort != None):
        if focuserComPort.in_waiting > 0: 
            data = focuserComPort.readline().decode()
            json_data = json.loads(data) 

    return json_data
     

