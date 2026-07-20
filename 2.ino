// - Adafruit Unified Sensor Lib: https://github.com/adafruit/Adafruit_Sensor
#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "DHT.h"
#include <SPI.h>
#include <SdFat.h>
#include <avr/wdt.h>
#define DHTPIN 2
#define DHTTYPE DHT22
#define ONE_WIRE_BUS 3
// Connect pin 1 (on the left) of the sensor to +5V
// NOTE: If using a board with 3.3V logic like an Arduino Due connect pin 1
// to 3.3V instead of 5V!
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 3 (on the right) of the sensor to GROUND (if your sensor has 3 pins)
// Connect pin 4 (on the right) of the sensor to GROUND and leave the pin 3 EMPTY (if your sensor has 4 pins)
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

DHT dht(DHTPIN, DHTTYPE);

#define BMP180_ADDRESS 0x77  // I2C address of BMP180

const unsigned char OSS = 0;  // Oversampling Setting

// Calibration values
// VCC:5V; SDA:A4; SCL: A5
int ac1;
int ac2;
int ac3;
unsigned int ac4;
unsigned int ac5;
unsigned int ac6;
int b1;
int b2;
int mb;
int mc;
int md;

long b5;

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

SdFat sd;
File file;

const int CS_PIN = 4;

void setup() {
  Serial.begin(9600);
  dht.begin();
  Wire.begin();
  bmp180Calibration();
  sensors.begin();
  wdt_enable(WDTO_2S);
  if (!sd.begin(CS_PIN, SD_SCK_MHZ(1))) {
    Serial.println("SD Fehler!");
    sd.initErrorHalt(&Serial);
  }

  file = sd.open("datalog.txt", FILE_WRITE);

  if (!file) {
    Serial.println("Datei konnte nicht geöffnet werden.");
    return;
  }

  file.println("millis|humidity|temperatureDHT|temperatureBMP|pressure|altitude|temperatureRod");
  file.close();
}

void loop() {
  sensors.requestTemperatures();
  float humidity = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float temperatureDHT = dht.readTemperature();
  float temperatureBMP = bmp180GetTemperature(bmp180ReadUT());  //MUST be called first
  float pressure = bmp180GetPressure(bmp180ReadUP());
  float altitude = calcAltitude(pressure);  //Uncompensated caculation - in Meters
  float temperatureRod = sensors.getTempCByIndex(0);

  if (isnan(humidity) || isnan(temperatureDHT)) {
    return;
  }
  file = sd.open("datalog.txt", FILE_WRITE);

  if (!file) {
    Serial.println("Datei konnte nicht geöffnet werden.");
    return;
  }

  file.print(millis());
  file.print("|");

  file.print(humidity, 2);
  file.print("|");

  file.print(temperatureDHT, 2);
  file.print("|");

  file.print(temperatureBMP, 2);
  file.print("|");

  file.print(pressure, 2);
  file.print("|");

  file.print(altitude, 2);
  file.print("|");

  file.println(temperatureRod, 2);

  file.close();
  wdt_reset();
  delay(5000);
}

// Stores all of the bmp180's calibration values into global variables
// Calibration values are required to calculate temp and pressure
// This function should be called at the beginning of the program
void bmp180Calibration() {
  ac1 = bmp180ReadInt(0xAA);
  ac2 = bmp180ReadInt(0xAC);
  ac3 = bmp180ReadInt(0xAE);
  ac4 = bmp180ReadInt(0xB0);
  ac5 = bmp180ReadInt(0xB2);
  ac6 = bmp180ReadInt(0xB4);
  b1 = bmp180ReadInt(0xB6);
  b2 = bmp180ReadInt(0xB8);
  mb = bmp180ReadInt(0xBA);
  mc = bmp180ReadInt(0xBC);
  md = bmp180ReadInt(0xBE);
}

// Calculate temperature in deg C
float bmp180GetTemperature(unsigned int ut) {
  long x1, x2;

  x1 = (((long)ut - (long)ac6) * (long)ac5) >> 15;
  x2 = ((long)mc << 11) / (x1 + md);
  b5 = x1 + x2;

  float temp = ((b5 + 8) >> 4);
  temp = temp / 10;

  return temp;
}

// Calculate pressure given up
// calibration values must be known
// b5 is also required so bmp180GetTemperature(...) must be called first.
// Value returned will be pressure in units of Pa.
long bmp180GetPressure(unsigned long up) {
  long x1, x2, x3, b3, b6, p;
  unsigned long b4, b7;

  b6 = b5 - 4000;
  // Calculate B3
  x1 = (b2 * (b6 * b6) >> 12) >> 11;
  x2 = (ac2 * b6) >> 11;
  x3 = x1 + x2;
  b3 = (((((long)ac1) * 4 + x3) << OSS) + 2) >> 2;

  // Calculate B4
  x1 = (ac3 * b6) >> 13;
  x2 = (b1 * ((b6 * b6) >> 12)) >> 16;
  x3 = ((x1 + x2) + 2) >> 2;
  b4 = (ac4 * (unsigned long)(x3 + 32768)) >> 15;

  b7 = ((unsigned long)(up - b3) * (50000 >> OSS));
  if (b7 < 0x80000000)
    p = (b7 << 1) / b4;
  else
    p = (b7 / b4) << 1;

  x1 = (p >> 8) * (p >> 8);
  x1 = (x1 * 3038) >> 16;
  x2 = (-7357 * p) >> 16;
  p += (x1 + x2 + 3791) >> 4;

  long temp = p;
  return temp;
}

// Read 1 byte from the BMP180 at 'address'
char bmp180Read(unsigned char address) {
  unsigned char data;

  Wire.beginTransmission(BMP180_ADDRESS);
  Wire.write(address);
  Wire.endTransmission();

  Wire.requestFrom(BMP180_ADDRESS, 1);
  while (!Wire.available())
    ;

  return Wire.read();
}

// Read 2 bytes from the BMP180
// First byte will be from 'address'
// Second byte will be from 'address'+1
int bmp180ReadInt(unsigned char address) {
  unsigned char msb, lsb;

  Wire.beginTransmission(BMP180_ADDRESS);
  Wire.write(address);
  Wire.endTransmission();

  Wire.requestFrom(BMP180_ADDRESS, 2);
  while (Wire.available() < 2)
    ;
  msb = Wire.read();
  lsb = Wire.read();

  return (int)msb << 8 | lsb;
}

// Read the uncompensated temperature value
unsigned int bmp180ReadUT() {
  unsigned int ut;

  // Write 0x2E into Register 0xF4
  // This requests a temperature reading
  Wire.beginTransmission(BMP180_ADDRESS);
  Wire.write(0xF4);
  Wire.write(0x2E);
  Wire.endTransmission();

  // Wait at least 4.5ms
  delay(5);

  // Read two bytes from registers 0xF6 and 0xF7
  ut = bmp180ReadInt(0xF6);
  return ut;
}

// Read the uncompensated pressure value
unsigned long bmp180ReadUP() {

  unsigned char msb, lsb, xlsb;
  unsigned long up = 0;

  // Write 0x34+(OSS<<6) into register 0xF4
  // Request a pressure reading w/ oversampling setting
  Wire.beginTransmission(BMP180_ADDRESS);
  Wire.write(0xF4);
  Wire.write(0x34 + (OSS << 6));
  Wire.endTransmission();

  // Wait for conversion, delay time dependent on OSS
  delay(2 + (3 << OSS));

  // Read register 0xF6 (MSB), 0xF7 (LSB), and 0xF8 (XLSB)
  msb = bmp180Read(0xF6);
  lsb = bmp180Read(0xF7);
  xlsb = bmp180Read(0xF8);

  up = (((unsigned long)msb << 16) | ((unsigned long)lsb << 8) | (unsigned long)xlsb) >> (8 - OSS);

  return up;
}

void writeRegister(int deviceAddress, byte address, byte val) {
  Wire.beginTransmission(deviceAddress);  // start transmission to device
  Wire.write(address);                    // send register address
  Wire.write(val);                        // send value to write
  Wire.endTransmission();                 // end transmission
}

int readRegister(int deviceAddress, byte address) {

  int v;
  Wire.beginTransmission(deviceAddress);
  Wire.write(address);  // register to read
  Wire.endTransmission();

  Wire.requestFrom(deviceAddress, 1);  // read a byte

  while (!Wire.available()) {
    // waiting
  }

  v = Wire.read();
  return v;
}

float calcAltitude(float pressure) {

  float A = pressure / 101325;
  float B = 1 / 5.25588;
  float C = pow(A, B);
  C = 1 - C;
  C = C / 0.0000225577;

  return C;
}
