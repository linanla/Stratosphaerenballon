#include <TinyGPS++.h>
#include <SoftwareSerial.h>

static const uint32_t GPSBaud = 9600;

// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(4, 3);

void setup() {
  Serial.begin(9600);
  Serial.println("Script 2");
  ss.begin(GPSBaud);
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
  if (newData && gps.location.isValid() && gps.satellites.value() > 0) {

    Serial.print("Latitude = ");
    Serial.println(gps.location.lat(), 6);

    Serial.print("Longitude = ");
    Serial.println(gps.location.lng(), 6);

    Serial.print("Satellites = ");
    Serial.println(gps.satellites.value());

    Serial.print("HDOP = ");
    Serial.println(gps.hdop.value());

  } else {
    Serial.println("Kein GPS Fix");
    Serial.print("Satellites = ");
    Serial.println(gps.satellites.value());
  }
}
