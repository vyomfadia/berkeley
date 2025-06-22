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
const float stepPerDegree = stepsPerRevolution / 90;

float current_pos = 0; // Current position of the stepper motor

bool left = false;
bool right = false;

void Move(float deg);
char** str_split(char* a_str, const char a_delim);

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
    command = "move -59.8";
    char temp[32];
    strncpy(temp, command, sizeof(temp)-1);
    temp[sizeof(temp)-1] = '\0';
    char **tokens = str_split(temp, ' ');
    if (tokens[0] && tokens[1]) {
      char *nums = tokens[1];
      int negative = 1;
      if (nums[0] == '-') {
        left = true;
        right = false;
        negative = -1;
        nums++;
      }
      else {
        left = false;
        right = true;
      }
      float angle = atof(nums) * negative;
      Serial.println(angle);
      
      Move(angle);
      delay(2000);
      Move(-65.0f);
    } else {
      Serial.println("Invalid command");
    }
  }
  else {
    Serial.println("No command received");
  }
}

void Move(float deg) {
  float target = current_pos + deg;
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

// Safe split function for Arduino (no malloc, static buffer, max tokens)
char** str_split(char* a_str, const char a_delim) {
    static char* tokens[MAX_TOKENS + 1];
    static char buffer[64];
    size_t len = strlen(a_str);
    if (len >= sizeof(buffer)) len = sizeof(buffer) - 1;
    strncpy(buffer, a_str, len);
    buffer[len] = '\0';
    size_t idx = 0;
    char* token = strtok(buffer, &a_delim);
    while (token && idx < MAX_TOKENS) {
        tokens[idx++] = token;
        token = strtok(NULL, &a_delim);
    }
    tokens[idx] = NULL;
    return tokens;
}