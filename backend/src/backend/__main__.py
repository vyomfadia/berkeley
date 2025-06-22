import cv2
import mediapipe as mp
import time

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Initialize webcam
cap = cv2.VideoCapture(0)  # Use 0 for built-in webcam

while cap.isOpened():
    success, image = cap.read()
    if not success:
        print("Failed to read from webcam")
        continue

    # Get image dimensions
    h, w, c = image.shape

    # Flip the image horizontally for a selfie-view display
    image = cv2.flip(image, 1)

    # Convert the BGR image to RGB
    results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

    # Draw hand landmarks
    if results.multi_hand_landmarks:
        for idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
            # Get hand position
            landmarks = hand_landmarks.landmark
            wrist_x = int(landmarks[mp_hands.HandLandmark.WRIST].x * w)

            # Determine which side of the camera the hand is on
            side = "Left side" if wrist_x < w / 2 else "Right side"

            # Get handedness (left hand or right hand)
            handedness = results.multi_handedness[idx].classification[0].label

            # Draw the hand landmarks
            mp_drawing.draw_landmarks(
                image,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style()
            )

            # Display handedness and side information
            cv2.putText(image, f"{handedness} hand on {side}",
                        (10, 30 + idx * 30), cv2.FONT_HERSHEY_SIMPLEX,
                        0.7, (0, 255, 0), 2)

    # Display the resulting frame
    cv2.imshow('MediaPipe Hand Tracking', image)

    # Exit on 'q' press
    if cv2.waitKey(5) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
