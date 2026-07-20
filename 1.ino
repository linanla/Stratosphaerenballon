#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <SPI.h>
#include <SdFat.h>

static const uint32_t GPSBaud = 9600;

// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(3, 2);

SdFat sd;
File file;

unsigned long timestamp = 0;
long latitude = 0;
long longitude = 0;
int satelites = 0;
int hdop = 0;
int kmh = 0;
int altitude = 0;

const int CS_PIN = 4;

void setup() {
  Serial.begin(9600);
  ss.begin(GPSBaud);

  if (!sd.begin(CS_PIN, SD_SCK_MHZ(1))) {
    Serial.println("SD Fehler!");
    sd.initErrorHalt(&Serial);
  }

  file = sd.open("datalog.txt", FILE_WRITE);
  file.println("millis|latitude|longitude|satelites|hdop|kmh|altitude");
}

void loop() {
  bool newData = false;
  // This sketch displays information every time a new sentence is correctly encoded.
  for (unsigned long start = millis(); millis() - start < 1000;) {
    while (ss.available()) {
      char c = ss.read();
      // Serial.write(c); // uncomment this line if you want to see the GPS data flowing
      if (gps.encode(c))  // Did a new valid sentence come in?
        newData = true;
    }
  }
  if (newData && gps.location.isValid() && gps.satellites.value() > 0 && file) {
    file.print(timestamp);
    file.print("|");

    file.print(latitude, 6);
    file.print("|");

    file.print(longitude, 6);
    file.print("|");

    file.print(satelites);
    file.print("|");

    file.print(hdop);
    file.print("|");

    file.print(kmh);
    file.print("|");

    file.println(altitude);
    timestamp = millis();
    latitude = gps.location.lat();
    longitude = gps.location.lng();
    satelites = gps.satellites.value();
    hdop = gps.hdop.hdop();
    kmh = gps.speed.kmph();
    altitude = gps.altitude.meters();
  } else {
    Serial.println("Kein GPS Fix");
    Serial.print("Satellites = ");
    Serial.println(gps.satellites.value());
  }
}
