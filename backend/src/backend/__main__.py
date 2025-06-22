from concurrent.futures import TimeoutError

import asyncio
import cv2
import mediapipe as mp
import websockets

loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)


async def connect_websocket():
    try:
        ws = await asyncio.wait_for(websockets.connect('ws://localhost:8000'), timeout=3)
        print("yeeehawwww")
        return ws
    except (TimeoutError, ConnectionRefusedError, OSError) as e:
        print("WebSocket connection failed", str(e))
        return None


ws = asyncio.get_event_loop().run_until_complete(connect_websocket())

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

last_position = None

cap = cv2.VideoCapture(1)
while cap.isOpened():
    success, image = cap.read()
    if not success:
        print("failed to read from webcam")
        continue

    h, w, c = image.shape
    image = cv2.flip(image, 1)

    results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    if results.multi_hand_landmarks:
        for idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
            landmarks = hand_landmarks.landmark
            wrist_x = int(landmarks[mp_hands.HandLandmark.WRIST].x * w)

            handedness = results.multi_handedness[idx].classification[0].label
            linear_position = (wrist_x / w * 2) - 1  # normalise for domain [-1, 1]

            linear_position = round(linear_position, 1)
            if linear_position != last_position:
                last_position = linear_position
                with open("hand_position.txt", "a+") as f:
                    f.write(f"{linear_position}\n")

            mp_drawing.draw_landmarks(
                image,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style()
            )

            cv2.putText(image, f"{handedness} hand at {linear_position}",
                        (10, 30 + idx * 30), cv2.FONT_HERSHEY_SIMPLEX,
                        0.7, (0, 255, 0), 2)


    cv2.imshow('MediaPipe Hand Tracking', image)
    if cv2.waitKey(5) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
