# Voice Agent

A voice-controlled camera rotation system that listens for voice commands and triggers camera actions.

## Setup

1. Install dependencies:
```bash
uv sync
```

2. Set up your OpenAI API key:
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

3. Run the voice agent:
```bash
uv run python -m voice_agent
```

## Usage

The voice agent listens for commands like:
- "rotate the camera in the direction I'm pointing"
- "rotate the camera"
- "this direction"
- "show me what's in this direction"
- "turn the camera"
- "point the camera"

When a valid command is detected, it will respond with "Rotating the camera by x degrees" and trigger the camera action.
