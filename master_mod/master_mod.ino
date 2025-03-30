#include <ArduinoJson.h>

const byte enablePin = 9;
const byte stepPinDec = 3;
const byte directionPinDec = 2;
const byte microStepPin1 = 8;
const byte microStepPin2 = 7;
const byte microStepPin3 = 6;

const byte stepPinHa = A1;
const byte directionPinHa = A0;
const byte microStepPinHa = A2;

long currentPositionHa = 0;
long currentPositionDec = 0;

boolean turnHa, turnDec;
boolean directionHa, directionDec;
boolean hiSpeedHa = true, hiSpeedDec = true;

long ha = 0, dec = 0;

long stepsLeftHa, stepsLeftDec;

String command = "";
float haSpeed = 0, decSpeed = 0;
float haMovement = 0;
long stepTime = 0;

void setup() {
  pinMode(enablePin, OUTPUT);
  digitalWrite(enablePin,LOW);
  
  Serial.begin(115200);
  Serial.setTimeout(3);

  pinMode(stepPinDec, OUTPUT);
  pinMode(directionPinDec, OUTPUT);

  pinMode(microStepPin1, OUTPUT);
  pinMode(microStepPin2, OUTPUT);
  pinMode(microStepPin3, OUTPUT);

  digitalWrite(microStepPin1, LOW);
  digitalWrite(microStepPin2, LOW);
  digitalWrite(microStepPin3, LOW);

  pinMode(stepPinHa, OUTPUT);
  pinMode(directionPinHa, OUTPUT);
  pinMode(microStepPinHa, OUTPUT);

  digitalWrite(microStepPinHa, LOW);
}

void addStep() { 
  digitalWrite(directionPinHa, directionHa);
  digitalWrite(directionPinDec, directionDec);
  delayMicroseconds(200);
  digitalWrite(stepPinHa, turnHa); 
  digitalWrite(stepPinDec, turnDec);
  delayMicroseconds(800); 
  digitalWrite(stepPinHa, LOW);
  digitalWrite(stepPinDec, LOW);
}

void calculateStaps(){
  if(command == "movement"){
    haMovement += (millis() - stepTime) * haSpeed;
    ha = haMovement;
    Serial.println(haMovement);
    stepTime = millis();
  }
  if (ha != currentPositionHa) {
    turnHa = true;
    if (ha > currentPositionHa) {
      directionHa = true;
      stepsLeftHa = ha - currentPositionHa;
      currentPositionHa += hiSpeedHa ? 128 : 1;
    } else {
      directionHa = false;
      stepsLeftHa = currentPositionHa - ha;
      currentPositionHa -= hiSpeedHa ? 128 : 1;
    }
  }else{
    turnHa = false;
  }
  if (dec != currentPositionDec) {
    turnDec = true;
    if (dec > currentPositionDec) {
      directionDec = true;
      stepsLeftDec = dec - currentPositionDec;
      currentPositionDec += hiSpeedDec ? 128 : 1;
    } else {
      directionDec = false;
      stepsLeftDec = currentPositionDec - dec;
      currentPositionDec -= hiSpeedDec ? 128 : 1;
    }
  }else{
    turnDec = false;
  }
  addStep();
}

void loop() {

  if (Serial.available() > 0) {
    String data = Serial.readString(); //{"ha":0,"dec":3840000}
    JsonDocument doc;
    deserializeJson(doc, data);
    ha = doc["ha"];
    haMovement = ha;
    dec = doc["dec"];
    String commandRead = doc["command"];
    command = commandRead;
    if(command == "movement"){
      stepTime = millis();
    }
    haSpeed = doc["haSpeed"];
    decSpeed = doc["decSpeed"];
  }else{
    if(abs(ha - currentPositionHa) > 1280){
      if(!hiSpeedHa){
        hiSpeedHa = true;
        while(currentPositionHa%128 != 0){
          currentPositionHa++;
          digitalWrite(directionPinHa, HIGH);
          delayMicroseconds(200);
          digitalWrite(stepPinHa, HIGH); 
          delayMicroseconds(800); 
          digitalWrite(stepPinHa, LOW);
        }
        digitalWrite(microStepPinHa, LOW);
        delay(100);
      }
    }else{
      if(hiSpeedHa){
        hiSpeedHa = false;
        digitalWrite(microStepPinHa, HIGH);
        delay(100);
      }
    }

    if(abs(dec - currentPositionDec) > 1280){
      if(!hiSpeedDec){
        hiSpeedDec = true;
        while(currentPositionDec%128 != 0){
          currentPositionDec++;
          digitalWrite(directionPinDec, HIGH);
          delayMicroseconds(200);
          digitalWrite(stepPinDec, HIGH);
          delayMicroseconds(800); 
          digitalWrite(stepPinDec, LOW);
        }
        digitalWrite(microStepPin1, LOW);
        digitalWrite(microStepPin2, LOW);
        digitalWrite(microStepPin3, LOW);
        delay(100);
      }
    }else{
      if(hiSpeedDec){
        hiSpeedDec = false;
        digitalWrite(microStepPin1, HIGH);
        digitalWrite(microStepPin2, HIGH);
        digitalWrite(microStepPin3, HIGH);

        delay(100);
      }
    }

    calculateStaps();

    //String str = "ha:" + String(currentPositionHa) + " dec:" + String(currentPositionDec);
    //Serial.println(str);
  }
}
