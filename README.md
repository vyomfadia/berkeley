# ICU – AI-Powered Environmental Awareness for the Visually Impaired

**ICU** is an assistive-technology prototype that provides visually impaired users with real-time awareness of their surroundings. A motorized camera, voice commands, and hand-gesture recognition work together to capture the environment, run AI analysis, and speak back contextual descriptions—acting as an “extra pair of eyes” so users can navigate safely and independently.

---

## Key Features

- **Natural voice interface** – Ask questions like “What’s in front of me?” or direct the camera with spoken commands.  
- **Gesture-based control** – Pointing gestures are tracked with MediaPipe; the camera pans automatically to the indicated direction.  
- **Real-time scene analysis** – Live video streams run through multimodal models (Gemini + local OpenAI Whisper) to identify objects, hazards, and text.  
- **Low-latency architecture** – WebSockets connect phone cameras, local ML services, and cloud inference for responsive feedback.  
- **Hardware prototype**  
  - ESP-32 microcontroller driving a stepper-motor pan-tilt camera  
  - Secondary fixed camera for hand-landmark extraction  
  - Python/C++ services running on a laptop (or Raspberry Pi)  

---

## Tech Stack

| Layer        | Tools & Libraries                                   |
|--------------|-----------------------------------------------------|
| AI / ML      | vapi • Google Gemini • MediaPipe • OpenCV |
| Hardware     | ESP-32 • Stepper motors • motor drivers  |
| Backend      | Flask API • WebSockets |
| Miscellaneous| C++, Red Bull, Stethescope, Superglue 😉 |

---

## Roadmap

- **Miniaturization** – Port to Raspberry Pi Zero 2 W or an all-mobile deployment.  
- **Expanded object ontology** – Better recognition of medication bottles, appliance states, and low-light scenes.  
- **Smart-home integration** – Act on findings (e.g., “turn off the stove”) via IoT APIs.  
- **Extended user testing** – Gather feedback from real users to refine voice NLP and gesture sensitivity.  

---

*Built at the **UC Berkeley AI Hackathon 2025** by Vyom Fadia, Jaymin Jhaveri, Katie Cheng, and Sam Mathew.*
