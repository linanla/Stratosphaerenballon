#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <SPI.h>
#include <SdFat.h>
#include <avr/wdt.h>

static const uint32_t GPSBaud = 9600;

// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(3, 2);

SdFat sd;
File file;

unsigned long timestamp = 0;
double latitude = 0;
double longitude = 0;
int satellites = 0;
double hdop = 0;
double kmh = 0;
double altitude = 0;

const int CS_PIN = 4;

void setup() {
  Serial.begin(9600);
  wdt_enable(WDTO_8S);
  ss.begin(GPSBaud);

  if (!sd.begin(CS_PIN, SD_SCK_MHZ(1))) {
    Serial.println("SD Fehler!");
    sd.initErrorHalt(&Serial);
  }

  file = sd.open("datalog.txt", FILE_WRITE);
  file.println("millis|latitude|longitude|satellites|hdop|kmh|altitude");
  file.close();
}

void loop() {
  bool newData = false;
  // This sketch displays information every time a new sentence is correctly encoded.
  for (unsigned long start = millis(); millis() - start < 1000;) {
    while (ss.available()) {
      char c = ss.read();
      if (gps.encode(c))  // Did a new valid sentence come in?
        newData = true;
    }
  }
  if (newData && gps.location.isValid() && gps.satellites.value() > 0) {
    wdt_reset();
    file = sd.open("datalog.txt", FILE_WRITE);
    wdt_reset();


    if (file) {
      timestamp = millis();
      latitude = gps.location.lat();
      longitude = gps.location.lng();
      satellites = gps.satellites.value();
      hdop = gps.hdop.hdop();
      kmh = gps.speed.kmph();
      altitude = gps.altitude.meters();
      file.print(timestamp);
      file.print("|");

      file.print(latitude, 6);
      file.print("|");

      file.print(longitude, 6);
      file.print("|");

      file.print(satellites);
      file.print("|");

      file.print(hdop, 1);
      file.print("|");

      file.print(kmh, 2);
      file.print("|");

      file.println(altitude, 2);
      file.close();
    }
  } else {
    Serial.println("Kein GPS Fix");
    Serial.print("Satellites = ");
    Serial.println(gps.satellites.value());
  }
  wdt_reset();
  delay(5000);
  wdt_reset();
}
