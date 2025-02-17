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
    try:
        telescopeComPort = serial.Serial(port, 9600) 
        return port + " connected"
    except:
        return port + " disconnected"
    
    

def serialWrite(data):
    global telescopeComPort
    dataJson = data
    print(dataJson)
    telescopeComPort.write(data)
    

def serialRead(port):
    ser = serial.Serial(port, 9600) # change 'COM3' to your Arduino port
    data = ser.readline().decode()
    ser.close()
    return data

