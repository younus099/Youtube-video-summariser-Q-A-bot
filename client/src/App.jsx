import { useState, useCallback } from "react";
import axios from "axios";
import UrlForm from "./components/UrlForm";
import VideoPlayer from "./components/VideoPlayer";
import RightPanel from "./components/RightPanel";

function App() {
  // ---- Core data state ----
  const [videoId, setVideoId] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [seekTime, setSeekTime] = useState(null);

  // ---- Video playback state ----
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // ---- UI state ----
  const [activeTab, setActiveTab] = useState("summary"); // "summary" | "chat" | "transcript"
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [askingAI, setAskingAI] = useState(false);
  const [userTabOverride, setUserTabOverride] = useState(false); // user manually switched tab during playback

  // Whether we have content loaded
  const hasContent = videoId || summary || transcript.length > 0;

  // ---- Handlers ----

  const handleAnalyze = async (url) => {
    try {
      setLoading(true);
      setError("");
      setChatHistory([]);
      setSummary("");
      setTranscript([]);
      setIsPlaying(false);
      setCurrentTime(0);

      const res = await axios.post("http://localhost:5000/api/transcript", { url });

      setVideoId(res.data.videoId);
      setTranscript(res.data.transcript);
      setSummary(res.data.summary);
      setActiveTab("summary");
    } catch (err) {
      setError("Failed to fetch transcript. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    const currentQuestion = question;
    setQuestion("");
    setChatHistory((prev) => [...prev, { role: "user", text: currentQuestion }]);
    setAskingAI(true);

    try {
      const fullTranscript = transcript.map((item) => item.text).join(" ");
      const res = await axios.post("http://localhost:5000/api/chat", {
        question: currentQuestion,
        transcript: fullTranscript,
      });
      setChatHistory((prev) => [...prev, { role: "ai", text: res.data.answer }]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setAskingAI(false);
    }
  };

  const handleSeek = useCallback((seconds) => {
    setSeekTime(seconds);
  }, []);

  const handlePlayStateChange = useCallback((playing) => {
    setIsPlaying(playing);
  }, []);


  const handleTimeUpdate = useCallback((time) => {
    setCurrentTime(time);
  }, []);

  // Tab definitions
  const tabs = [
    { id: "summary", label: "Summary", icon: "📋" },
    { id: "chat", label: "Ask", icon: "💬" },
    { id: "transcript", label: "Transcript", icon: "📝" },
  ];

  // ---- Render ----

  return (
    <div className="max-w-[1600px] mx-auto px-3 py-3 h-full flex flex-col overflow-hidden">

      {/* ===== HEADER ===== */}
      <header className="flex items-center justify-between gap-4 mb-3 shrink-0 animate-fade-slide-down">
        {/* Brand */}
        <h1 className="font-heading text-xl font-bold text-dark-brown tracking-tight shrink-0">
          YouTube AI
        </h1>

        {/* URL Form — center */}
        <UrlForm onSubmit={handleAnalyze} loading={loading} />

        {/* Spacer for balance */}
        <div className="w-20 shrink-0 hidden sm:block" />
      </header>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-error-bg border border-error/25 rounded-lg text-error text-sm mb-4 animate-fade-slide-up">
          <span>⚠️</span>
          <span>{error}</span>
          <button
            className="ml-auto text-error/60 hover:text-error cursor-pointer bg-transparent border-none text-lg"
            onClick={() => setError("")}
          >
            ✕
          </button>
        </div>
      )}

      {/* ===== LANDING STATE ===== */}
      {!loading && !hasContent && (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="text-6xl mb-4 opacity-30">📖</div>
          <h2 className="font-heading text-2xl font-semibold text-dark-brown mb-2">
            Turn any video into knowledge
          </h2>
          <p className="text-text-muted text-sm max-w-md">
            Paste a YouTube link above to get an AI summary, browse the transcript, and ask questions about the content.
          </p>
        </div>
      )}

      {/* ===== LOADING SKELETON ===== */}
      {loading && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[2.5fr_1.2fr] gap-3 min-h-0">
          <div className="flex flex-col gap-3">
            <div className="skeleton-shimmer aspect-video rounded-xl" />
            <div className="skeleton-shimmer h-9 w-64 rounded-full" />
          </div>
          <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
            <div className="skeleton-shimmer h-4 w-[40%] mb-3 rounded" />
            <div className="skeleton-shimmer h-3 w-full mb-2 rounded" />
            <div className="skeleton-shimmer h-3 w-[80%] mb-2 rounded" />
            <div className="skeleton-shimmer h-3 w-[60%] rounded" />
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      {!loading && hasContent && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[2.5fr_1.2fr] gap-3 min-h-0 overflow-hidden">

          {/* LEFT COLUMN — Video + Tab Buttons */}
          <div className="flex flex-col gap-3 min-h-0">
            {/* Video Player */}
            <VideoPlayer
              videoId={videoId}
              seekTime={seekTime}
              onPlayStateChange={handlePlayStateChange}
              onTimeUpdate={handleTimeUpdate}
            />

            {/* Segmented Tab Control */}
            <div className="inline-flex p-1 bg-paper-dark rounded-full shrink-0 self-start border border-border-subtle">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`
                    flex items-center gap-1.5 px-4 py-1.5 rounded-full
                    font-[var(--font-body)] text-sm font-medium cursor-pointer
                    transition-all duration-200 border-none
                    ${activeTab === tab.id
                      ? "bg-bg-card text-text-primary shadow-sm"
                      : "bg-transparent text-text-muted hover:text-text-secondary"
                    }
                  `}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (isPlaying) {
                      setUserTabOverride(tab.id !== "transcript");
                    }
                  }}
                  id={`tab-${tab.id}`}
                >
                  <span className="text-xs">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Playing indicator */}
            {isPlaying && !userTabOverride && (
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-olive font-medium animate-fade-in">
                <div className="w-1.5 h-1.5 rounded-full bg-olive animate-pulse-soft" />
                Video is playing — transcript auto-scrolling →
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Smart Panel */}
          <div className="bg-bg-card border border-border-subtle rounded-xl shadow-card min-h-0 overflow-hidden">
            <RightPanel
              isPlaying={isPlaying}
              currentTime={currentTime}
              transcript={transcript}
              summary={summary}
              chatHistory={chatHistory}
              onSeek={handleSeek}
              question={question}
              setQuestion={setQuestion}
              onAsk={handleAsk}
              askingAI={askingAI}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userTabOverride={userTabOverride}
              setUserTabOverride={setUserTabOverride}
            />
          </div>

        </div>
      )}
    </div>
  );
}

export default App;