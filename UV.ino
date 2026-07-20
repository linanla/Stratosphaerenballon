int sensorPin = A0;
float analogSignal;
float voltage;
float uvIndex;

void setup(){
  Serial.begin(9600);
}

void loop(){
  analogSignal = analogRead(sensorPin);
  voltage = analogSignal/1023*5;
  uvIndex = voltage / 0.1;
  Serial.print("Signal: "); Serial.println(analogSignal);
  Serial.print("Volt: "); Serial.println(voltage);
  Serial.print("UV-Index: "); Serial.println(uvIndex);
  Serial.println("------------------------------");
  
  delay(1000);
}
