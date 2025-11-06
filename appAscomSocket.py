import socket, datetime

ip_address = '127.0.1.2'  # желаемый IP-адрес
port = 9998  # желаемый номер порта
port2 = 9997  # желаемый номер порта

# Настраиваем сокет
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((ip_address, port))
server_socket.listen(10)
print('server is running, please, press ctrl+c to stop')

# Настраиваем сокет
server_socket2 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket2.bind((ip_address, port2))
server_socket2.listen(10)
print('server is running, please, press ctrl+c to stop')

localDate = ""
localTime = ""

latitude = "+56*45:12"
longitude = "-043*45:12"

ra = "03:00:00"
dec = "+90*00:00"

Az = "03:00:00#"
Alt = "+90*00:00#"

parked = False
tracking = True
goto = False

#N-Not slewing, H-At Home position,
#P-Parked, p-Not parked, F-Park Failed,
#I-park In progress, R-PEC Recorded
#G-Guiding in progress, S-GPS PPS Synced

def return_value(myString):
    #print(myString)
    global parked, tracking, goto, ra, dec, Az, Alt 
    
    if myString == ":GVP#":
        return "On-Step#"
    elif myString == ":GXEE#":
        return "1"
    elif myString == ":GXE6#":
        return "237.037050#"
    elif myString == ":SXE9,0#":
        return "1"
    elif myString == ":GXE9#":
        return "0#"
    elif myString == ":GXEA#":
        return "32#"
    elif myString == ":SX92,124.75#":
        return "1"
    elif myString == ":SXEA,32#":
        return "1"
    elif myString == ":GVN#":
        return "4.24s#"

    elif myString == ":GL#":
        current_time = datetime.datetime.now()
        string = current_time.strftime('%H:%M:%S')  + "#"
        return string
    
    # Get time (Local, 24hr format)
    elif myString == ":GC#":
        current_time = datetime.datetime.now()
        string = current_time.strftime('%d/%m/%y')  + "#"
        #GC += 1
        return string #"01/01/20#" #localDate.text

    # Get date
    elif myString.startswith(':SC'):
        localDate = myString[3:12]
        #calculateDate()
        parameterSet = True
        return "1"  # Set date

    elif myString.startswith(':SL'):
        localTime = myString[3:12]
        #calculateTime()
        parameterSet = True
        return "1" # Set time (Local)
    
    elif myString.startswith(':Sr'):
        ra = myString[3:10]
        #goto = True
        return "1"  # Set target RA
    
    elif myString.startswith(':Sd'):
        dec = myString[3:6] + "*" + myString[7:12]
        #goto = True
        return "1"  # Set target Dec
    
    elif myString.startswith(':Sz'):
        Az = myString[2:12]
        return "1"  # Set target Az
    
    elif myString.startswith(':Sa'):
        Hi = myString[2:12]
        return "1"  # Set target Alt

    elif myString == ":GS#":
        current_time = datetime.datetime.now()
        string = current_time.strftime('%H:%M:%S')  + "#"
        return string
        ##calculateSiderealTime()
        #return "04:00:50#" #siderealTime.text + "#"  # Get time (Sidereal)"04:00:50#"

    elif myString == ":Gm#":
        return "W#"  # Pier side

    elif myString == ":GX90#":
        return "1.00#" 

    elif myString == ":GX92#":
        return "124.750#" 
    elif myString == ":GX93#":
        return "124.750#"  
    
    elif myString == ":GR#" or myString == ":GRa#":
        return ra + "#" #RA.text  # Get telescope RA

    elif myString == ":GD#" or myString == ":GDe#":
        return dec + "#" #"+90*00:00#"

    elif myString == ":GG#":
        return "+3#"  # Get UTC Offset (for current site)

    elif myString == ":SG+03#":
        return "1"  # Set UTC Offset (for current site)


    elif myString == ":GA#":
        return Alt #"+11*22:33#"  # Get telescope Alt

    elif myString == ":GT#":
        if(tracking):
            return "60.16427#"  # Get sidereal rate RA
        else:
            return "0.00000#"

    elif myString == ":GZ#":
        return Az #"123*44:56#" # Get telescope Azm
    
    elif myString == ":GU#":
        result = ""
        if(tracking == False):
            result = "n"
        
        if(goto == False):
            result += "N"
        
        if(parked):
            result +="P"
        else:
            result +="p"
            
        return result + "z/ET260#"#nNpH/Eo260# # Get telescope Status
    
    elif myString == ":MS#":
        return "0" # Move telescope (to current Equ target)
    	
    elif myString == ":GtH#":
        return latitude + "#" # Get current site Latitude, positive for North latitudes
    
    elif myString == ":GgH#":
        return longitude + "#" # Get current site Longitude
    
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
        return "-20*#" # Get Horizon Limit, the minimum elevation of the mount relative to the horizon
    
    elif myString == ":Go#":
        return "90*#" #Get Overhead Limit
    
    elif myString == ":Me#":
        return "" #Move telescope east (at current rate)
    
    elif myString == ":Mw#":
        return "" #Move telescope west (at current rate)
    
    elif myString == ":Mn#":
        return "" #Move telescope north (at current rate)
    
    elif myString == ":Ms#":
        return "" #Move telescope south (at current rate)
    
    elif myString == ":hP#":
        parked = True
        return "1#" #Move to park position
    
    elif myString == ":hR#":
        parked = False
        return "1#" #Restore parked telescope to operation
    
    elif myString == ":Te#":
        tracking = True
        return "1" #Tracking enable
    
    elif myString == ":Td#":
        tracking = False
        return "1" #Tracking disable
    
    
    elif myString == ":FA#":
        return "1" #Focuser1 Active?
    #print(myString)
    
    elif myString == ":FI#":
        return "1520#" #Get full in position (in microns or steps)
    
    elif myString == ":fA#":
        return "0#" #Focuser2 Active?

    elif myString == ":Fi#":
        return "0#" #?
    
    elif myString == ":Fm#":
        return "0#" #?
    
    elif myString == ":Fb#":
        return "0#" #?
    
    elif myString == ":Fd#":
        return "0#" #?
    
    elif myString == ":Fa#":
        return "1#" #Get primary focuser
    
    elif myString == ":Fe#":
        return "1#" #Get primary focuser
    
    elif myString == ":Fp#":
        return "0#" #Get mode
    
    elif myString == ":Fm#":
        return "1.0#" #Get focuser microns per step

    elif myString == ":Fu#":
        return "1.0#" #Get focuser microns per step
         
    elif myString == ":FC#":
        return "1#" #Get focuser microns per step
    
    elif myString == ":Fg#":
        return "1#" #Get focuser microns per step
    
    elif myString == ":Fc#":
        return "1#" #Get focuser microns per step    
    
    
    elif myString == ":GXY0#":
        return "SWITCH#" #  
    
    return "0"

# Слушаем запросы
while True:
    connection, address = server_socket.accept()
    #print("new connection from {address}".format(address=address))
    data = connection.recv(1024)
    #print(data)
    ascomStr = data.decode()
    
    #print(ascomStr)
    sendValue = return_value(ascomStr)
    #print(sendValue)
    str = ""
    if(sendValue == "#"):
        str = "error: "
    str += ascomStr + "->" + sendValue
    print(str)

    if(sendValue != ""):
        sendValueByte = sendValue.encode() #bytes(sendValue, encoding='ASCII')
        connection.send(sendValueByte)
    connection.close()
    
    