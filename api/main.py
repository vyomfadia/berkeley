import os
import time

import cv2
import google.generativeai as genai
from PIL import Image
from flask import Flask, jsonify, request
from pydantic import BaseModel
import serial

app = Flask(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GOOGLE_API_KEY')  # Set this in your environment variables
genai.configure(api_key=GEMINI_API_KEY)

serial = serial.Serial('/dev/tty.usbserial-0001', 115200)
angle = None


class ToolFunction(BaseModel):
    name: str
    arguments: dict


class ToolCall(BaseModel):
    id: str
    function: ToolFunction


class Message(BaseModel):
    timestamp: int
    toolCalls: list[ToolCall]


class ToolCallMessage(BaseModel):
    message: Message


def capture_photo():
    """Capture a photo using the default camera"""
    try:
        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            raise Exception("Could not open camera")

        ret, frame = camera.read()
        camera.release()
        if not ret:
            raise Exception("Could not capture image")

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image = Image.fromarray(frame_rgb)
        return image
    except Exception as e:
        raise Exception(f"Camera capture failed: {str(e)}")


def describe_image_with_gemini(image, *, context=None):
    """Send image to Gemini for description"""
    try:
        model = genai.GenerativeModel('gemini-2.5-flash-lite-preview-06-17')
        prompt = f"""
        Provide a short description of the surroundings in the image.
        The context of why you are asked would be a visually impaired individual who just asked for a snapshot of their surroundings from a camera.
        They mentioned a direction so the way you are facing is the direction they are interested in.
        
        Additional context you MUST SPECIFICALLY look out for in the image:
        {context or ''}
        """

        response = model.generate_content([prompt, image])
        return response.text
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")


@app.route('/', methods=['POST'])
def describe_surroundings():
    message = ToolCallMessage(**request.json)

    """Endpoint to capture photo and get AI description"""
    toolCall = message.message.toolCalls[0]
    direction = toolCall.function.arguments.get('direction', None)
    context = toolCall.function.arguments.get('context', None)
    dont_change = toolCall.function.arguments.get('dontChange', False)
    full_sweep = toolCall.function.arguments.get('fullSweep', False)

    print("direction", direction)
    print("context", context)
    print("dont_change", dont_change)
    print("full_sweep", full_sweep)

    print("🎥 TRIGGERING CAMERA ROTATION ACTION")
    print("📡 This is where we would call the MediaPipe backend")

    global angle
    if not dont_change and not full_sweep:
        if direction == "left":
            angle = 90
        elif direction == "right":
            angle = -90
        elif direction == "forward":
            angle = 0
        else:
            with open("hand_position.txt", "r") as f:
                lines = f.readlines()
                if lines:
                    last_position = float(lines[-1].strip())
                    angle = last_position * -90

        angle = round(angle)

        # Send angle over serial
        serial.write(f"move {angle} degrees\n".encode())
        time.sleep(1.5)

    try:
        if not full_sweep:
            image = capture_photo()
            description = describe_image_with_gemini(image, context=context)

        if full_sweep:
            angle = -90
            serial.write(f"move {angle} degrees\n".encode())
            time.sleep(2)

            print("capturing 1")
            time.sleep(1)
            image1 = capture_photo()

            angle = 0
            serial.write(f"move {angle} degrees\n".encode())
            time.sleep(2)

            print("capturing 2")
            time.sleep(1)
            image2 = capture_photo()

            angle = 90
            serial.write(f"move {angle} degrees\n".encode())
            time.sleep(2)

            print("capturing 3")
            time.sleep(1)
            image3 = capture_photo()

            description1 = describe_image_with_gemini(image1, context=context)
            description2 = describe_image_with_gemini(image2, context=context)
            description3 = describe_image_with_gemini(image3, context=context)

            description = f"LEFT FACING IMAGE: {description1}\n\n FORWARD FACING IMAGE: {description2}\n\n RIGHT FACING IMAGE: {description3}"

        return jsonify({
            'success': True,
            'message': 'Image captured and analyzed successfully',
            'results': [
                {
                    "toolCallId": toolCall.id,
                    "result": f"{description}\n\nThe camera is facing {angle} degrees from forward (positive is clockwise, to the right)."
                }
            ]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to capture or analyze image'
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'Visual Assistant API'})


if __name__ == '__main__':
    # Check if Gemini API key is set
    if not GEMINI_API_KEY:
        print("Warning: GOOGLE_API_KEY environment variable not set")

    app.run(debug=True, host='0.0.0.0', port=8000)
