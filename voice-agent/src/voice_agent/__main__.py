import base64
import json
import logging
import os
import queue
import tempfile
import threading
import wave
from typing import Optional

import asyncio
import pyaudio
import websockets
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RealtimeVoiceAgent:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")

        # WebSocket connection
        self.websocket: Optional[websockets.WebSocketServerProtocol] = None
        self.is_connected = False

        # Audio settings
        self.sample_rate = 24000  # Required by Realtime API
        self.chunk_size = 1024
        self.format = pyaudio.paInt16
        self.channels = 1
        self.bytes_per_sample = 2  # 16-bit audio

        # Audio components
        self.audio = pyaudio.PyAudio()
        self.input_stream = None

        # Audio queues for threading
        self.audio_input_queue = queue.Queue()
        self.audio_output_buffer = bytearray()
        self.audio_buffer_lock = threading.Lock()

        # Control flags
        self.is_recording = False
        self.should_stop = False
        self.is_speaking = False

        # Audio playback thread
        self.playback_thread = None
        self.playback_event = threading.Event()

    async def connect_to_realtime_api(self):
        """Connect to OpenAI Realtime API via WebSocket"""
        url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "OpenAI-Beta": "realtime=v1"
        }

        try:
            self.websocket = await websockets.connect(url, additional_headers=headers)
            self.is_connected = True
            logger.info("✅ Connected to OpenAI Realtime API")

            # Configure the session
            await self.configure_session()

        except Exception as e:
            logger.error(f"❌ Failed to connect to Realtime API: {e}")
            raise

    async def configure_session(self):
        """Configure the Realtime API session"""
        session_config = {
            "type": "session.update",
            "session": {
                "modalities": ["text", "audio"],
                "instructions": """You are a voice assistant for a camera control system. 
                Listen for commands to rotate or move the camera based on hand pointing directions.

                When you detect camera movement commands like:
                - "move the camera"
                - "rotate the camera" 
                - "turn the camera"
                - "point the camera"
                - "look this way"
                - "show me what's in this direction"

                Respond with brief acknowledgment like "Rotating camera now" or "Moving camera to that direction".
                Keep responses very short and natural.""",
                "voice": "alloy",
                "input_audio_format": "pcm16",
                "output_audio_format": "pcm16",
                "input_audio_transcription": {
                    "model": "whisper-1"
                },
                "turn_detection": {
                    "type": "server_vad",
                    "threshold": 0.5,
                    "prefix_padding_ms": 300,
                    "silence_duration_ms": 500
                },
                "tools": []
            }
        }

        await self.send_event(session_config)
        logger.info("📋 Session configured")

    async def send_event(self, event):
        """Send an event to the Realtime API"""
        if self.websocket and self.is_connected:
            await self.websocket.send(json.dumps(event))

    def play_audio_chunk(self, audio_data):
        """Play audio data using a separate thread and temporary file"""
        try:
            # Create temporary file
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                # Create WAV file
                with wave.open(temp_file.name, 'wb') as wav_file:
                    wav_file.setnchannels(self.channels)
                    wav_file.setsampwidth(self.bytes_per_sample)
                    wav_file.setframerate(self.sample_rate)
                    wav_file.writeframes(audio_data)

                # Play using system command (works better than PyAudio for playback)
                os.system(f"afplay {temp_file.name}")

                # Clean up
                os.unlink(temp_file.name)

        except Exception as e:
            logger.error(f"❌ Error playing audio: {e}")

    def start_playback_thread(self):
        """Start the audio playback thread"""
        if self.playback_thread is None or not self.playback_thread.is_alive():
            self.playback_thread = threading.Thread(target=self.audio_playback_worker, daemon=True)
            self.playback_thread.start()
            logger.info("🔊 Audio playback thread started")

    def audio_playback_worker(self):
        """Worker thread for audio playback"""
        while not self.should_stop:
            try:
                # Wait for audio data to be available
                if len(self.audio_output_buffer) > 0:
                    with self.audio_buffer_lock:
                        # Get all available audio data
                        audio_data = bytes(self.audio_output_buffer)
                        self.audio_output_buffer.clear()

                    if len(audio_data) > 0:
                        # Play the audio
                        self.play_audio_chunk(audio_data)

                # Small delay to prevent busy waiting
                threading.Event().wait(0.1)

            except Exception as e:
                logger.error(f"❌ Error in playback worker: {e}")

    async def handle_server_events(self):
        """Handle incoming events from the Realtime API"""
        try:
            async for message in self.websocket:
                event = json.loads(message)
                event_type = event.get("type")

                if event_type == "session.created":
                    logger.info("🎉 Session created successfully")

                elif event_type == "session.updated":
                    logger.info("🔄 Session updated")

                elif event_type == "input_audio_buffer.speech_started":
                    logger.info("🎤 Speech started")
                    self.is_speaking = True
                    # Clear any pending audio output to avoid conflicts
                    with self.audio_buffer_lock:
                        self.audio_output_buffer.clear()

                elif event_type == "input_audio_buffer.speech_stopped":
                    logger.info("🔇 Speech stopped")
                    self.is_speaking = False

                elif event_type == "conversation.item.input_audio_transcription.completed":
                    transcript = event.get("transcript", "")
                    logger.info(f"🗣️  Heard: '{transcript}'")

                    # Analyze if this is a camera command
                    if self.is_camera_command(transcript):
                        logger.info("🎥 Camera command detected!")
                        self.trigger_camera_action()

                elif event_type == "response.audio.delta":
                    # Receive audio data from the API and buffer it
                    if not self.is_speaking:  # Only play if user is not speaking
                        audio_data = base64.b64decode(event["delta"])
                        with self.audio_buffer_lock:
                            self.audio_output_buffer.extend(audio_data)

                elif event_type == "response.audio.done":
                    logger.info("🔊 Audio response completed")

                elif event_type == "response.done":
                    logger.info("✅ Response completed")

                elif event_type == "error":
                    logger.error(f"❌ API Error: {event}")

        except websockets.exceptions.ConnectionClosed:
            logger.info("🔌 WebSocket connection closed")
            self.is_connected = False
        except Exception as e:
            logger.error(f"❌ Error handling server events: {e}")

    def is_camera_command(self, text: str) -> bool:
        """Analyze if the text contains camera movement commands"""
        camera_keywords = [
            "move the camera", "rotate the camera", "turn the camera",
            "point the camera", "look this way", "show me what's",
            "this direction", "that way", "over here", "pan the camera",
            "camera", "rotate", "turn", "move", "point", "look", "left", "right"
        ]

        text_lower = text.lower()
        return any(keyword in text_lower for keyword in camera_keywords)

    def trigger_camera_action(self):
        """Trigger camera rotation action"""
        logger.info("🎥 TRIGGERING CAMERA ROTATION ACTION")
        logger.info("📡 This is where we would call the MediaPipe backend")

        with open("hand_position.txt", "r") as f:
            lines = f.readlines()
            if lines:
                last_position = lines[-1].strip()
                logger.info(f"📍 Last hand position: {last_position}")
            else:
                logger.info("📍 No hand positions recorded yet")

    def start_audio_input(self):
        """Start audio input stream"""
        try:
            self.input_stream = self.audio.open(
                format=self.format,
                channels=self.channels,
                rate=self.sample_rate,
                input=True,
                frames_per_buffer=self.chunk_size,
                stream_callback=self.audio_input_callback
            )
            self.input_stream.start_stream()
            self.is_recording = True
            logger.info("🎤 Audio input started")
        except Exception as e:
            logger.error(f"❌ Failed to start audio input: {e}")

    def audio_input_callback(self, in_data, frame_count, time_info, status):
        """Callback for audio input"""
        if self.is_recording and not self.should_stop:
            # Only send audio if we're not receiving a response
            if not self.is_speaking or len(self.audio_output_buffer) == 0:
                self.audio_input_queue.put(in_data)
        return (None, pyaudio.paContinue)

    async def send_audio_data(self):
        """Send audio data to the Realtime API"""
        while not self.should_stop and self.is_connected:
            try:
                if not self.audio_input_queue.empty():
                    audio_data = self.audio_input_queue.get_nowait()

                    # Convert to base64 and send to API
                    audio_base64 = base64.b64encode(audio_data).decode('utf-8')

                    event = {
                        "type": "input_audio_buffer.append",
                        "audio": audio_base64
                    }

                    await self.send_event(event)

                await asyncio.sleep(0.01)  # Small delay to prevent overwhelming the API
            except queue.Empty:
                await asyncio.sleep(0.01)
            except Exception as e:
                logger.error(f"❌ Error sending audio data: {e}")
                break

    async def run(self):
        """Main run loop"""
        try:
            # Connect to the Realtime API
            await self.connect_to_realtime_api()

            # Start audio input stream
            self.start_audio_input()

            # Start audio playback thread
            self.start_playback_thread()

            logger.info("🎤 Voice Agent Started! Speak to interact with the camera system")
            logger.info("📋 Try saying: 'rotate the camera' or 'move the camera this way'")

            # Create tasks for handling events and sending audio
            tasks = [
                asyncio.create_task(self.handle_server_events()),
                asyncio.create_task(self.send_audio_data())
            ]

            # Wait for tasks to complete
            await asyncio.gather(*tasks, return_exceptions=True)

        except KeyboardInterrupt:
            logger.info("\n🛑 Voice Agent stopped by user")
        except Exception as e:
            logger.error(f"❌ Error in main loop: {e}")
        finally:
            await self.cleanup()

    async def cleanup(self):
        """Clean up resources"""
        self.should_stop = True
        self.is_recording = False

        # Stop audio streams
        if self.input_stream:
            self.input_stream.stop_stream()
            self.input_stream.close()

        # Wait for playback thread to finish
        if self.playback_thread and self.playback_thread.is_alive():
            self.playback_thread.join(timeout=2)

        # Close WebSocket connection
        if self.websocket and self.is_connected:
            await self.websocket.close()

        # Terminate PyAudio
        self.audio.terminate()

        logger.info("🧹 Cleanup completed")


async def main():
    """Main function"""
    # Check if OpenAI API key is set
    if not os.getenv("OPENAI_API_KEY"):
        logger.error("❌ Please set your OPENAI_API_KEY environment variable")
        logger.error("You can create a .env file with: OPENAI_API_KEY=your_api_key_here")
        return

    agent = RealtimeVoiceAgent()
    await agent.run()


if __name__ == "__main__":
    asyncio.run(main())
