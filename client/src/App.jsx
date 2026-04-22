import { useState } from "react";
import axios from "axios";
import UrlForm from "./components/UrlForm";
import VideoPlayer from "./components/VideoPlayer";
import TranscriptViewer from "./components/TranscriptViewer";

function App() {
  const [videoId, setVideoId] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAnalyze = async (url) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/api/transcript",
        { url }
      );

      setVideoId(res.data.videoId);
      setTranscript(res.data.transcript);
      setSummary(res.data.summary);

    } catch (err) {
      setError("Failed to fetch transcript");
    } finally {
      setLoading(false);
    }
  };

  
  const formattedTranscript = transcript.map(item => {
  const seconds = Math.floor(item.offset / 1000);
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  const time = `${minutes}:${remaining
    .toString()
    .padStart(2, "0")}`;

  return `[${time}] ${item.text}`;
  }).join("\n");

  const handleAsk = async () => {
    const fullTranscript = formattedTranscript;

    const res = await axios.post(
     "http://localhost:5000/api/chat",
      {
        question,
        transcript: fullTranscript
      }
    );

    setAnswer(res.data.answer);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>YouTube Summarizer & Q&A Assistant</h1>

      <UrlForm onSubmit={handleAnalyze} />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {videoId && <VideoPlayer videoId={videoId} />}
      
      {summary && (
        <div>
         <h2>Summary</h2>
         <pre>{summary}</pre>
        </div>
      )}

      <div>
        <h2>Ask About Video</h2>

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask question"
        />

        <button onClick={handleAsk}>
          Ask
        </button>

        {answer && <p>{answer}</p>}
      </div>

      <TranscriptViewer transcript={transcript} />
    </div>

  );
}

export default App;