import socket, datetime
import serial
import serial.tools.list_ports
import time

ip_address = '127.0.1.2'  # желаемый IP-адрес
port = 9998  # желаемый номер порта
port2 = 9997  # желаемый номер порта

# Настраиваем сокет
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((ip_address, port))
server_socket.listen(10)
print('server is running, please, press ctrl+c to stop')

localDate = ""
localTime = ""

latitude = "+56*45:12"
longitude = "-043*45:12"

ra = "03:00:00"
dec = "+90*00:00"

Az = "03:00:00#"
Alt = "+90*00:00#"

parked = True
tracking = False
goto = False

#N-Not slewing, H-At Home position,
#P-Parked, p-Not parked, F-Park Failed,
#I-park In progress, R-PEC Recorded
#G-Guiding in progress, S-GPS PPS Synced

telescopeComPort = serial.Serial('COM3', 9600)
if telescopeComPort.is_open:
    print("Connected")   
      
time.sleep(3.0) 


        
def return_value(ascomStr):
    print(ascomStr)
    global telescopeComPort
    telescopeComPort.write(b':GVP#') 
    time.sleep(0.5)  
    dataRead = '0'
    if telescopeComPort.in_waiting > 0: 
        dataRead = telescopeComPort.readline.decode()
    return dataRead.encode("utf-8")

sendString = ":GVP#"
sendValue = return_value(sendString.encode("utf-8"))
print(sendValue)
    
if(telescopeComPort != None):
    telescopeComPort.close()
    print("Disconnected")
    
# Слушаем запросы
while True:
        
    connection, address = server_socket.accept()
    #print("new connection from {address}".format(address=address))
    data = connection.recv(1024)
    #print(data)
    ascomStr = data#.decode('utf-8')#.decode()
    
    #print(ascomStr)
    #sendValue = return_value(":GVP#").decode("utf-8")
    #print(sendValue)
    #str = ""
    #if(sendValue == "#"):
    #    str = "error: "
    #str += ascomStr.decode() + "->" + sendValue
    #print(str)

    #if(sendValue != ""):
    #    sendValueByte = sendValue.encode() #bytes(sendValue, encoding='ASCII')
    #    connection.send(sendValueByte)
    connection.close()
    

    
    