# YouTube AI Assistant

An AI-powered YouTube video analysis tool that fetches transcripts, generates summaries using Google Gemini, and lets you ask questions about video content with timestamp-based answers.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?logo=google&logoColor=white)

## Features

- **Video Transcript Extraction** — Automatically fetches transcripts from any YouTube video
- **AI-Powered Summaries** — Generates structured summaries with key points using Google Gemini
- **Interactive Q&A** — Ask questions about the video and get answers with relevant timestamps
- **Live Transcript Following** — Transcript auto-scrolls and highlights the active segment during playback
- **Smart Scroll Detection** — Manual scrolling pauses auto-follow; directional arrows guide you back
- **Tab State Management** — Intelligent tab switching during playback with automatic state restoration
- **Embedded Video Player** — YouTube player with play/pause state tracking and seek-to-timestamp support

## Screenshots

### Home Page
![Home Page](./Home%20page.png)

### Video Analysis
![Video Analysis](./Video%20page.png)

### AI Q&A Chat
![AI Q&A Chat](./Q&A%20page.png)

### Transcript Following
![Transcript Following](./Transcript%20page.png)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Backend | Node.js, Express 5 |
| AI | Google Gemini (gemini-2.5-flash-lite) |
| Transcript | youtube-transcript |
| Fonts | Space Grotesk, Inter, JetBrains Mono |

## Architecture

```text
Frontend (React)
        ↓
Backend (Express)
        ↓
Gemini API
        ↓
Transcript Processing
```

## Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── App.jsx          # Main app — state management, layout
│   │   ├── main.jsx         # Entry point
│   │   ├── components/
│   │   │   ├── UrlForm.jsx          # URL input + analyze button
│   │   │   ├── VideoPlayer.jsx      # YouTube IFrame player wrapper
│   │   │   ├── RightPanel.jsx       # Smart panel — auto-switches content
│   │   │   ├── TranscriptViewer.jsx # Transcript with smart auto-scroll
│   │   │   ├── SummaryView.jsx      # Markdown-rendered summary
│   │   │   └── ChatPanel.jsx        # AI Q&A chat interface
│   │   └── styles/
│   │       └── app.css      # Design system — colors, typography, animations
│   └── index.html
│
├── Server/                  # Express backend
│   ├── index.js             # Server entry point
│   ├── controllers/
│   │   ├── transcriptController.js  # Transcript fetch + summary generation
│   │   └── chatController.js        # AI Q&A endpoint
│   ├── services/
│   │   └── geminiService.js         # Google Gemini API wrapper
│   ├── routes/
│   │   ├── transcriptRoutes.js      # POST /api/transcript
│   │   └── chatRoutes.js            # POST /api/chat
│   └── utils/
│       └── extractVideoId.js        # YouTube URL parser
│
└── ai-service/              # Python RAG service (next iteration)
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/younus099/Youtube-video-summariser-Q-A-bot.git
cd Youtube-video-summariser-Q-A-bot
```

### 2. Set up the backend

```bash
cd Server
npm install
```

Create a `.env` file in the `Server/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### 3. Set up the frontend

```bash
cd client
npm install
```

### 4. Run the application

**Terminal 1 — Backend:**
```bash
cd Server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## How It Works

1. **Paste** a YouTube video URL and click **Analyze**
2. The backend fetches the transcript and generates an AI summary via Gemini
3. The frontend displays the embedded video alongside a smart panel with:
   - **Summary** — AI-generated overview with key points
   - **Ask** — Chat with the AI about the video content
   - **Transcript** — Full transcript with clickable timestamps
4. **Play the video** — the transcript auto-scrolls to follow playback
5. **Click any timestamp** to seek the video to that point

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/transcript` | Fetches transcript + generates summary |
| `POST` | `/api/chat` | Answers questions about the video |

### Request/Response Examples

**POST /api/transcript**
```json
// Request
{ "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }

// Response
{
  "success": true,
  "videoId": "dQw4w9WgXcQ",
  "transcript": [{ "text": "...", "offset": 0, "duration": 5000 }],
  "summary": "## Summary\n..."
}
```

**POST /api/chat**
```json
// Request
{ "question": "What is discussed at 2 minutes?", "transcript": "..." }

// Response
{ "success": true, "answer": "At around 2:00, the speaker discusses..." }
```

## Roadmap

### Completed
- [x] Transcript extraction and display
- [x] AI summary generation (Gemini)
- [x] Interactive Q&A with timestamps
- [x] Live transcript following with smart scroll
- [x] Tab state management during playback

### In Progress
- [ ] Transcript search with keyword highlighting
- [ ] Video metadata display (title, channel, duration)

### Planned
- [ ] RAG-based AI service (vector search over transcript chunks)

## License

MIT