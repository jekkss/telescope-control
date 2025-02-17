import socket, datetime

# Задаем адрес сервера
SERVER_ADDRESS = ('192.168.0.1', 9998)

ip_address = '0.0.0.0'  # желаемый IP-адрес
port = 9998  # желаемый номер порта

# Настраиваем сокет
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((ip_address, port))
server_socket.listen(10)
print('server is running, please, press ctrl+c to stop')



def return_value(myString):
    if myString == ":GVP#":
        return "On-Step#"
    elif myString == ":GXEE#":
        return "1.00#"
    elif myString == ":GVN#":
        return "4.17o#"

    elif myString == ":GL#":
        current_time = datetime.datetime.now()
        string = current_time.strftime('%H:%M:%S')  + "#"
        return string
    
    # Get time (Local, 24hr format)
    elif myString == ":GC#":
        current_time = datetime.datetime.now()
        string = current_time.strftime('%d/%m/%y')  + "#"
        return string #"01/01/20#" #localDate.text

    # Get date
    elif myString.startswith(':SC'):
        #localDate.text = myString[3:12]
        #calculateDate()
        parameterSet = True
        return "1"  # Set date

    elif myString.startswith(':SL'):
        #localTime.text = myString[3:12]
        #calculateTime()
        parameterSet = True
        return "1" # Set time (Local)

    elif myString == ":GS#":
        current_time = datetime.datetime.now()
        string = current_time.strftime('%H:%M:%S')  + "#"
        return string
        ##calculateSiderealTime()
        #return "04:00:50#" #siderealTime.text + "#"  # Get time (Sidereal)"04:00:50#"

    elif myString == ":Gm#":
        return "N#"  # Pier side

    elif myString == ":GX90#":
        return "0#" 

    elif myString == ":GX92#":
        return "1#" 
    elif myString == ":GX93#":
        return "2#"  
    
    elif myString == ":GR#" or myString == ":GRa#":
        return "00*00:00#" #RA.text  # Get telescope RA

    elif myString == ":GD#" or myString == ":GDe#":
        return "+90*00:00#"

    elif myString == ":GG#":
        return "+03#"  # Get UTC Offset (for current site)

    elif myString == ":SG+03#":
        return "1"  # Set UTC Offset (for current site)


    elif myString == ":GA#":
        return "+00*00:00#"  # Get telescope Alt

    elif myString == ":GT#":
        return "1.3#"  # Get sidereal rate RA

    elif myString == ":GZ#":
        return "000*00#" # Get telescope Azm
    
    elif myString == ":GU#":
        return "nNp#" # Get telescope Status
    
    elif myString == ":GtH#":
        return "+56*45:12#" # Get current site Latitude, positive for North latitudes
    
    elif myString == ":GgH#":
        return "-043*45:12#" # Get current site Longitude
    
    elif myString == ":%BD#":
        return "0#" # Get Dec/Alt Antibacklash value in arc-seconds
    
    elif myString == ":%BR#":
        return "0#" # Get RA/Azm Antibacklash value in arc-seconds
    
    elif myString == ":$BR0#":
        return "1" # Set RA/Azm Antibacklash value in arc-seconds
    
    elif myString == ":$BD0#":
        return "1" # Set RA/Azm Antibacklash value in arc-seconds
    
    elif myString == ":Sh-20#":
        return "1"
    
    elif myString == ":So90#":
        return "1"
    
    elif myString == ":Gh#":
        return "-200#" # Get Horizon Limit, the minimum elevation of the mount relative to the horizon
    
    elif myString == ":Go#":
        return "900#" #Get Overhead Limit
    
    print(myString)
    return "0.00#"


# Слушаем запросы
while True:
    connection, address = server_socket.accept()
    #print("new connection from {address}".format(address=address))
    data = connection.recv(1024)
    ascomStr = data.decode()
    #print(ascomStr)
    sendValue = return_value(ascomStr)
    sendValueByte = sendValue.encode('ASCII') #bytes(sendValue, encoding='ASCII')
    connection.send(sendValueByte)
    connection.close()