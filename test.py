
import serial

ser = serial.Serial('COM4', 9600) # change 'COM3' to your Arduino port

while True:
    data = input("Enter data to send: ")
    ser.write(data.encode()) # send data to Arduino
    print("Sent data: " + data)

    arduino_data = ser.readline().decode('utf-8')#.strip().decode() # read data from Arduino
    print("Received data: " + arduino_data)