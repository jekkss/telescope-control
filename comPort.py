import serial
import serial.tools.list_ports
import json

telescopeComPort = None

def serialPorts():
    ports = serial.tools.list_ports.comports()
    portList = []
    for port in ports:
        portList.append(port.device)
    return portList

def serialOpen(data):
    global telescopeComPort
    port = data.decode('utf-8').replace('"', '')
    
    if(telescopeComPort != None):
        telescopeComPort.close()
        
        telescopeComPort = serial.Serial(port, 115200)
        
        if telescopeComPort.is_open:
           return port + " open" 
    else:
        try:
            telescopeComPort = serial.Serial(port, 115200) 
            return port + " connected"
        except:
            return port + " disconnected"
    
    

def serialWrite(data):
    global telescopeComPort
    #dataJson = data
    
    if telescopeComPort.is_open:
        telescopeComPort.write(data)
        print(data)
    

def serialRead(port):
    ser = serial.Serial(port, 115200)
    data = ser.readline().decode()
    ser.close()
    return data

