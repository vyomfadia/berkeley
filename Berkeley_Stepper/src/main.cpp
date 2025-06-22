#include <Arduino.h>
#include <Stepper.h>
#include <string.h>
#include <math.h>

#define IN1 19
#define IN2 18
#define IN3 5
#define IN4 17

#define MAX(a, b) ((a) < (b) ? (a) : (b))
#define CLAMP(a, min, max) ((a) < (min) ? (min) : ((a) > (max) ? (max) : (a)))

#define DEBUG 1 // Set to 1 to enable debug mode, 0 to disable

const int stepsPerRevolution = 2048;
const float stepPerDegree = stepsPerRevolution / 270;

float current_pos = 0; // Current position of the stepper motor

bool negative = false;

void Move(float deg);
const char* sanitize(const char *num);

#define MAX_TOKENS 4

// initialize the stepper library
Stepper myStepper(stepsPerRevolution, IN1, IN3, IN2, IN4);

void setup() {
  // set the speed at 5 rpm
  myStepper.setSpeed(10);
  // initialize the serial port
  Serial.begin(115200);
}

void loop() {
  const char* command = nullptr;

  if (Serial.available() || DEBUG) {
    //command = Serial.readStringUntil('\n').c_str();
      const char *command = "40.5";
      const char *cleaned = sanitize(command);
      float angle = atof(cleaned) * (negative ? -1 : 1);
      Serial.print("Moving to absolute position: ");
      Serial.println(angle);
      
      Move(angle);
      delay(1000);
      Move(0);
      delay(1000);
      Move(-30);
      delay(1000);
      Move(90);
      delay(1000);
      Move(0);
      delay(1000);
      Move(-90);
      delay(1000);
  }
  else {
    Serial.println("Invalid command");
  }
}

void Move(float deg) {
  deg *= -1;
  if (current_pos == deg){
    return;
  }
  // Treat deg as absolute target position, not relative movement
  float target = deg;
  // Clamp the target to the allowed range
  float clamped_target = CLAMP(target, -90.0f, 90.0f);
  float actual_move = clamped_target - current_pos;
  if (fabs(actual_move) < 1e-3) {
    Serial.print("Move ignored: already at limit. Current: ");
    Serial.println(current_pos);
    return;
  }
  int steps = actual_move * stepPerDegree;
  myStepper.step(steps);
  current_pos = clamped_target;
  Serial.print("Moved to position: ");
  Serial.println(current_pos);
}

// Safe sanitize function for Arduino (no malloc, static buffer)
const char* sanitize(const char *num) {
  static char out[16];
  int j = 0;
  negative = false;
  for (int i = 0; num[i] != '\0' && j < (int)sizeof(out)-1; i++) {
    if (num[i] == '-') {
      negative = true;
      continue;
    }
    if (isdigit((unsigned char)num[i]) || num[i] == '.') {
      out[j++] = num[i];
    }
  }
  out[j] = '\0';
  return out;
}