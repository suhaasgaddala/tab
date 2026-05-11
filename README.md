# voya

Voice and gesture-powered AI canvas for visual productivity.

voya helps people think out loud and build visually. The Phase 1 MVP turns messy thoughts into organized notes, tasks, diagrams, and workflows on an infinite canvas with a deterministic AI assistant mock when no AI key is configured.

## Phase 1 MVP features

- Polished startup landing page, features page, pricing page, and sign-in page
- Dashboard with recent canvases, templates, activity, quick actions, and spaces
- Canvas editor with left workspace sidebar, dotted infinite-canvas surface, draggable visual cards, connection lines, right AI assistant panel, and bottom voice command bar
- Create new canvases and add/move canvas cards
- Save canvas state to `localStorage`
- Mock voice command that sends `Organize this canvas and turn the next steps into tasks.`
- AI assistant actions: summarize this space, turn this into tasks, create a flow diagram, find related ideas, and organize this canvas
- Express API that accepts canvas context and returns structured JSON canvas actions with trace-style output

## Architecture

- Backend: Express + TypeScript
- Frontend: React + Vite + TypeScript
- Styling: Tailwind plus product-specific CSS
- Motion: Framer Motion
- Icons: lucide-react
- Persistence: `localStorage` for Phase 1 canvas state
- AI mode: deterministic mock mode by default, with environment placeholders for OpenAI or Anthropic
- Supabase scaffold remains available for future auth and persistence work

## Backend routes

- `GET /health`
- `GET /v1/voya/capabilities`
- `POST /v1/voya/agent/run`
- `POST /v1/voya/canvas/summarize`
- `POST /v1/voya/canvas/organize`
- `POST /v1/voya/voice/command`

The main agent endpoint accepts:

```json
{
  "canvasId": "demo",
  "command": "Organize this canvas",
  "mode": "text",
  "selectedObjectIds": [],
  "objects": []
}
```

It returns an answer, optional summary, structured `actions`, and an execution `trace`.

## Local setup

```bash
npm install
npm --prefix frontend install
npm run dev
npm run dev:frontend
```

Open the frontend at `http://localhost:5173`.

Useful checks:

```bash
npm run typecheck
npm run build:frontend
```

## Demo commands

Try these in the canvas assistant:

- `Summarize this space`
- `Turn this into tasks`
- `Create a flow diagram`
- `Find related ideas`
- `Organize this canvas`
- `Capture a note about improving onboarding clarity`

## Environment

Copy `.env.example` and fill in optional keys when needed. voya runs in deterministic mock mode without keys.

```bash
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
VOYA_MOCK_AI=true
```

## Next steps

- Real voice transcription
- Gesture controls with MediaPipe
- Supabase persistence
- Real-time collaboration
- Native mobile app later
