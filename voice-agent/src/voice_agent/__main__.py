import os
import time
import wave
import pyaudio
import tempfile
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

class VoiceAgent:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.is_listening = False
        # Audio recording settings
        self.chunk = 1024
        self.format = pyaudio.paInt16
        self.channels = 1
        self.rate = 44100
        self.record_seconds = 3  # Record for 3 seconds when triggered
        
        # Initialize PyAudio
        self.audio = pyaudio.PyAudio()
        
    def record_audio(self):
        """Record audio from microphone"""
        print("Listening for voice command...")
        
        stream = self.audio.open(
            format=self.format,
            channels=self.channels,
            rate=self.rate,
            input=True,
            frames_per_buffer=self.chunk
        )
        
        frames = []
        
        # Record for specified duration
        for i in range(0, int(self.rate / self.chunk * self.record_seconds)):
            data = stream.read(self.chunk)
            frames.append(data)
        
        stream.stop_stream()
        stream.close()
        
        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        wf = wave.open(temp_file.name, 'wb')
        wf.setnchannels(self.channels)
        wf.setsampwidth(self.audio.get_sample_size(self.format))
        wf.setframerate(self.rate)
        wf.writeframes(b''.join(frames))
        wf.close()
        
        return temp_file.name
    
    def speech_to_text(self, audio_file_path):
        """Convert speech to text using OpenAI Whisper"""
        try:
            with open(audio_file_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                )
            return transcript.text
        except Exception as e:
            print(f"Error in speech-to-text: {e}")
            return None
    
    def analyze_command(self, text):
        """Use LLM to analyze if the command should trigger camera rotation"""
        system_prompt = """You are a voice command analyzer for a camera control system. 
        Analyze the given text and determine if it's a command to rotate or move the camera based on hand pointing direction.
        
        HIGH CONFIDENCE phrases (should be 0.8-1.0):
        - "move the camera"
        - "rotate the camera"
        - "turn the camera"
        - "point the camera"
        - "rotate the camera in the direction I'm pointing"
        - "show me what's in this direction"
        - "this direction" (when used as a command)
        - "look this way"
        - "pan the camera"
        
        MEDIUM CONFIDENCE phrases (should be 0.5-0.7):
        - "over here"
        - "that way"
        - "switch direction"
        
        Assign high confidence (0.8+) to clear camera movement commands.
        
        Respond with a JSON object:
        {
            "should_act": true/false,
            "confidence": 0.0-1.0,
            "reasoning": "brief explanation"
        }
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Analyze this text: '{text}'"}
                ],
                temperature=0.1
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            print(f"Error in command analysis: {e}")
            return {"should_act": False, "confidence": 0.0, "reasoning": "Analysis failed"}
    
    def text_to_speech(self, text):
        """Convert text to speech using OpenAI TTS"""
        try:
            response = self.client.audio.speech.create(
                model="tts-1",
                voice="alloy",
                input=text
            )
            
            # Save to temporary file and play
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
            response.stream_to_file(temp_file.name)
            
            # Play the audio file (using system command)
            os.system(f"afplay {temp_file.name}")  # macOS
            
            # Clean up
            os.unlink(temp_file.name)
            
        except Exception as e:
            print(f"Error in text-to-speech: {e}")
    
    def trigger_camera_action(self):
        """Placeholder for camera rotation action"""
        print("🎥 TRIGGERING CAMERA ROTATION ACTION")
        print("📡 This is where we would call the MediaPipe backend")
        
        # Speak the response
        response_text = "Rotating the camera by x degrees"
        print(f"🔊 Speaking: {response_text}")
        self.text_to_speech(response_text)
    
    def listen_continuous(self):
        """Main loop to continuously listen for voice commands"""
        print("🎤 Voice Agent Started! Press Ctrl+C to stop")
        print("📋 Listening for commands like 'rotate the camera in the direction I'm pointing'")
        
        try:
            while True:
                # Record audio
                audio_file = self.record_audio()
                
                try:
                    # Convert to text
                    text = self.speech_to_text(audio_file)
                    
                    if text:
                        print(f"🗣️  Heard: '{text}'")
                        
                        # Analyze the command
                        analysis = self.analyze_command(text)
                        print(f"🧠 Analysis: {analysis}")
                        
                        if analysis["should_act"] and analysis["confidence"] > 0.5:
                            print("✅ Command recognized! Triggering camera action...")
                            self.trigger_camera_action()
                        else:
                            print("❌ Command not recognized or confidence too low")
                    else:
                        print("🔇 No speech detected")
                        
                except Exception as e:
                    print(f"Error processing audio: {e}")
                
                finally:
                    # Clean up audio file
                    if os.path.exists(audio_file):
                        os.unlink(audio_file)
                
                # Small delay before next recording
                time.sleep(0.5)
                
        except KeyboardInterrupt:
            print("\n🛑 Voice Agent stopped")
        finally:
            self.audio.terminate()

def main():
    # Check if OpenAI API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ Please set your OPENAI_API_KEY environment variable")
        print("You can create a .env file with: OPENAI_API_KEY=your_api_key_here")
        return
    
    agent = VoiceAgent()
    agent.listen_continuous()

if __name__ == "__main__":
    main()
