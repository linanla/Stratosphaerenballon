#include <mpu6050.h>
#include <SPI.h>
#include <SdFat.h>
#include <avr/wdt.h>

#define MPU_ADDRESS 0x68  //  mpu6050 address is 0x69 if AD0 pin is powered -  otherwise it's 0x68

float rawGX, rawGY, rawGZ;           // initialise raw gyroscope variables
float rawAX, rawAY, rawAZ;           // initialise raw accelerometer variables
float dpsGX, dpsGY, dpsGZ;           // initialise dps gyroscope variables
float gForceAX, gForceAY, gForceAZ;  // initialise g force accelerometer variables

SdFat sd;
File file;

const int CS_PIN = 4;

int sensorPin = A0;
float analogSignal;
float voltage;
float uvIndex;

void setup() {
  Serial.begin(9600);
  wakeSensor(MPU_ADDRESS);  // wakes sensor from sleep mode
  wdt_enable(WDTO_8S);

  if (!sd.begin(CS_PIN, SD_SCK_MHZ(16))) {
    Serial.println("SD Fehler!");
    sd.initErrorHalt(&Serial);
  }

  file = sd.open("datalog.txt", FILE_WRITE);

  if (!file) {
    Serial.println("Datei konnte nicht geöffnet werden.");
    return;
  }

  file.println("millis|gX|gY|gZ|aX|aY|aZ|UVIndex");
  file.close();
}

void loop() {
  readGyroData(MPU_ADDRESS, rawGX, rawGY, rawGZ);                       // pass MPU6050 address and gyroscope values are written to 3 provided variables
  rawGyroToDPS(rawGX, rawGY, rawGZ, dpsGX, dpsGY, dpsGZ);               // provide the 3 raw gyroscope values and returns them in their dps (degrees per second) values
  readAccelData(MPU_ADDRESS, rawAX, rawAY, rawAZ);                      // pass MPU6050 address and accelerometer values are written to 3 provided variables
  rawAccelToGForce(rawAX, rawAY, rawAZ, gForceAX, gForceAY, gForceAZ);  // provide the 3 raw accelerometer values and returns them in their g force values

  analogSignal = analogRead(sensorPin);
  voltage = analogSignal * 5.0 / 1023.0;
  uvIndex = voltage / 0.1;
  wdt_reset();
  file = sd.open("datalog.txt", FILE_WRITE);
  wdt_reset();

  if (!file) {
    Serial.println("Datei konnte nicht geöffnet werden.");
    return;
  }
  file.print(millis());
  file.print("|");
  
  file.print(dpsGX, 2);
  file.print("|");

  file.print(dpsGY, 2);
  file.print("|");

  file.print(dpsGZ, 2);
  file.print("|");

  file.print(gForceAX, 2);
  file.print("|");

  file.print(gForceAY, 2);
  file.print("|");

  file.print(gForceAZ, 2);
  file.print("|");

  file.println(uvIndex, 2);

  file.close();
  wdt_reset();
  delay(5000);
  wdt_reset();
}
