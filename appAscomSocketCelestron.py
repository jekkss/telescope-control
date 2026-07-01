import socket 
 
client_socket = None
 
def socketOpen(data):
    global client_socket
    
    index = data.find(b':')
    host = data[0:index]
    port = data[index + 1 : len(data)]    
    
    if(client_socket != None):
        client_socket.close()
        
    try:
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((host, int(port)))
        return "connected"
    except (OSError, ValueError) as error:
        print(f"Error connecting socket to {host}:{port}: {error}")
        client_socket = None
        return "disconnected"


def socketWrite(data):
    global client_socket
    client_socket.sendall(data) 
    return 1


def socketRead(data):
    global client_socket
    response = client_socket.recv(1024) 
    print(f'Ответ от сервера: {response.decode()}')
    return response.decode()

def socketClose(data):
    global client_socket
    client_socket.close()
    return 1