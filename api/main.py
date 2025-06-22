import os

import cv2
import google.generativeai as genai
from PIL import Image
from flask import Flask, request, jsonify

app = Flask(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GOOGLE_API_KEY')  # Set this in your environment variables
genai.configure(api_key=GEMINI_API_KEY)


def capture_photo():
    """Capture a photo using the default camera"""
    try:
        # Initialize camera
        camera = cv2.VideoCapture(0)

        if not camera.isOpened():
            raise Exception("Could not open camera")

        # Capture frame
        ret, frame = camera.read()
        camera.release()

        if not ret:
            raise Exception("Could not capture image")

        # Convert BGR to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Convert to PIL Image
        image = Image.fromarray(frame_rgb)

        return image

    except Exception as e:
        raise Exception(f"Camera capture failed: {str(e)}")


def describe_image_with_gemini(image):
    """Send image to Gemini for description"""
    try:
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-2.5-flash')

        # Create prompt for visual assistance
        prompt = """
        Provide a short description of the surroundings in the image.
        The context of why you are asked would be a visually impaired individual who just asked for a snapshot of their surroundings from a camera.
        They mentioned a direction so the way you are facing is the direction they are interested in.
        """

        # Generate description
        response = model.generate_content([prompt, image])

        return response.text

    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")


@app.route('/describe-surroundings', methods=['POST'])
def describe_surroundings():
    """Endpoint to capture photo and get AI description"""
    try:
        # Capture photo from camera
        image = capture_photo()

        # Get description from Gemini
        description = describe_image_with_gemini(image)

        # Optional: Save the captured image (for debugging)
        # image.save('captured_image.jpg')

        return jsonify({
            'success': True,
            'description': description,
            'message': 'Image captured and analyzed successfully'
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
