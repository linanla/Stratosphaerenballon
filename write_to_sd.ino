#include <SPI.h>
#include <SdFat.h>

SdFat sd;
File file;

const int CS_PIN = 4;

void setup() {
  Serial.begin(115200);

  if (!sd.begin(CS_PIN, SD_SCK_MHZ(1))) {
    Serial.println("SD Fehler!");
    sd.initErrorHalt(&Serial);
  }

  file = sd.open("datalog.txt", FILE_WRITE);

  if (file) {
    file.println("test");
    file.close();
    Serial.println("Geschrieben.");
  }
}

void loop() {
}
