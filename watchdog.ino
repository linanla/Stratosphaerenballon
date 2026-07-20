#include <avr/wdt.h>

void setup() {
  // put your setup code here, to run once:
Serial.begin(9600);
Serial.println("System gestartet...");
wdt_enable(WDTO_2S);
}

void loop() {
  // put your main code here, to run repeatedly:
Serial.println("Programm läuft normal");
wdt_reset();
delay(3000);
}
