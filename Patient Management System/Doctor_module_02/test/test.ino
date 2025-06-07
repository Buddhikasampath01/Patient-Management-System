
#include <Arduino.h>
#include <OneButton.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define WIFI_SSID "Dialog 4G 273"
#define WIFI_PASSWORD "907354e3"
#define API_KEY "AIzaSyCC4ukNHjuZMI2KazX-dJXWRKNK00wawZk"
#define DATABASE_URL "https://sampath-323fb-default-rtdb.asia-southeast1.firebasedatabase.app/"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
LiquidCrystal_I2C lcd(0x27, 16, 2);

const int buttonPin1 = 4;            
OneButton button1(buttonPin1, true);  
const int buttonPin2 = 15;            
OneButton button2(buttonPin2, true);  
int buttonState2 = 0;
int buttonState1 = 0;
int patient1 = 0;
int patient2 = 0;
int assignPatient = 0;
int value = 0;
const int buzzerPin = 13;

void setup() {
  lcd.init(); 
  pinMode(buzzerPin, OUTPUT);
  lcd.backlight();
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    lcd.setCursor(1, 0);
    lcd.print("Connecting....");
    delay(300);
  }
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  if (Firebase.signUp(&config, &auth, "", "")) {
    lcd.clear();
    lcd.setCursor(1, 0);
    lcd.print("Ready to call");
    lcd.setCursor(4, 1);
    lcd.print("Patients");
  } else {
    lcd.clear();
    lcd.setCursor(3, 0);
    lcd.print("Sign up is");
    lcd.setCursor(2, 1);
    lcd.print(" Unsuccessful");
  }
  config.token_status_callback = tokenStatusCallback;  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  button1.attachClick(singlePress);
  button2.attachClick(doublePress);
  button1.attachDoubleClick(doubleClick);
  button2.attachDoubleClick(doubleClick);
  Firebase.RTDB.setInt(&fbdo, "PATIENT02", patient2);
  Firebase.RTDB.setInt(&fbdo, "DOCTOR02", buttonState2);
  Firebase.RTDB.setInt(&fbdo, "CALLING", 0);
}

void loop() {
  button1.tick();
  button2.tick();
  buttonState2 = 0;
  patient2 = 0;
  digitalWrite(buzzerPin, LOW);
}

void singlePress() {
  lcd.clear();
  digitalWrite(buzzerPin, HIGH);
  lcd.setCursor(0, 0);
  lcd.print("Calling the");
  lcd.setCursor(4, 1);
  lcd.print("Next patient");
  delay(100);
  digitalWrite(buzzerPin, LOW);
  buttonState1 = buttonState1 + 1;
  buttonState2 = buttonState1;
  sendOne();
  delay(1000);
  getValue();
}

void doublePress() {
  lcd.clear();
  digitalWrite(buzzerPin, HIGH);
  lcd.setCursor(0, 0);
  lcd.print("Patient not here");
  patient1 = patient1 + 1;
  patient2 = patient1;
  sendTwo();
  digitalWrite(buzzerPin, LOW);
}

static void sendOne() {
  if (Firebase.RTDB.setInt(&fbdo, "DOCTOR02", buttonState2)) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Passed the value");
    delay(100);
  } else {
    buttonState1 = buttonState1 - 1;
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Value sending");
    lcd.setCursor(10, 0);
    lcd.print("Failed");
    delay(100);
  }
}

static void sendTwo() {
  if (Firebase.RTDB.setInt(&fbdo, "PATIENT02", patient2)) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Passed the value");
    delay(100);
    lcd.setCursor(0, 0);
    lcd.print("Patient not here");
  } else {
    patient1 = patient1 - 1;
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Value sending");
    lcd.setCursor(10, 0);
    lcd.print("Failed");
    delay(100);
  }
}

static void getValue() {
  if (Firebase.RTDB.getInt(&fbdo, "/ROOMS/ROOM02")) {
    if (fbdo.dataType() == "int") {
      value = fbdo.intData();
      lcd.clear();
      lcd.setCursor(2, 0);
      lcd.print("Your current");
      lcd.setCursor(1, 1);
      lcd.print("Patient : ");
      lcd.setCursor(11, 1);
      lcd.print(value);
    }
  } else { 
    lcd.clear();
    lcd.setCursor(4, 0);
    lcd.print("No value");
  }
}

 void longPressSend(int value) {
  if (Firebase.RTDB.setInt(&fbdo, "CALLING", value)) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Recalling the");
    lcd.setCursor(9, 1);
    lcd.print("Patient");
  } else {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Value sending");
    lcd.setCursor(10, 1);
    lcd.print("Failed");
    delay(100);
  }
}

void doubleClick() {
  longPressSend(5);
  digitalWrite(buzzerPin, HIGH);
  delay(1000);
  longPressSend(0);
  digitalWrite(buzzerPin, LOW);
}

