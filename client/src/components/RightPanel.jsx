import { useRef, useEffect } from "react";
import TranscriptViewer from "./TranscriptViewer";
import SummaryView from "./SummaryView";
import ChatPanel from "./ChatPanel";

/**
 * RightPanel — Smart panel that auto-switches content based on video state.
 *
 * When video is PLAYING (no override):
 *   → Shows transcript with auto-scroll to current timestamp
 *
 * When video is PLAYING (user override):
 *   → Shows whatever tab the user deliberately chose
 *   → If user chose transcript, resumes auto-scroll at current position
 *
 * When video is PAUSED:
 *   → Restores the user's last active tab (summary / chat / transcript)
 *
 * Props:
 *   isPlaying        — boolean — video play state
 *   currentTime      — number (seconds)
 *   transcript       — array of { text, offset }
 *   summary          — string
 *   chatHistory      — array
 *   onSeek           — (seconds) => void
 *   question         — string
 *   setQuestion      — setter
 *   onAsk            — () => void
 *   askingAI         — boolean
 *   activeTab        — "summary" | "chat" | "transcript"
 *   setActiveTab     — setter
 *   userTabOverride  — boolean — user deliberately switched tab during playback
 *   setUserTabOverride — setter
 */
function RightPanel({
  isPlaying,
  currentTime,
  transcript,
  summary,
  chatHistory,
  onSeek,
  question,
  setQuestion,
  onAsk,
  askingAI,
  activeTab,
  setActiveTab,
  userTabOverride,
  setUserTabOverride,
}) {
  // Remember the tab user was on before playback started
  const savedTabRef = useRef(activeTab);
  const prevPlayingRef = useRef(false);

  useEffect(() => {
    const wasPlaying = prevPlayingRef.current;
    prevPlayingRef.current = isPlaying;

    if (isPlaying && !wasPlaying) {
      // Just started playing → save current tab, switch to transcript, clear any override
      savedTabRef.current = activeTab;
      setActiveTab("transcript");
      setUserTabOverride(false);
    } else if (!isPlaying && wasPlaying) {
      // Just stopped playing → restore saved tab, clear override
      setActiveTab(savedTabRef.current);
      setUserTabOverride(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Also keep savedTabRef in sync when user manually switches tabs while NOT playing
  useEffect(() => {
    if (!isPlaying) {
      savedTabRef.current = activeTab;
    }
  }, [activeTab, isPlaying]);

  // During playback, show transcript UNLESS user has overridden
  const showingAutoTranscript = isPlaying && !userTabOverride;

  // Header text
  const getHeaderContent = () => {
    if (showingAutoTranscript) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-olive animate-pulse-soft" />
          <span className="text-xs font-medium text-olive uppercase tracking-wider">
            Now Playing — Following Transcript
          </span>
        </div>
      );
    }

    return (
      <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
        {activeTab === "summary" && "📋 Summary"}
        {activeTab === "chat" && "💬 Chat"}
        {activeTab === "transcript" && "📝 Transcript"}
      </span>
    );
  };

  // Content rendering
  const renderContent = () => {
    // Auto-scroll transcript during playback (no override)
    if (showingAutoTranscript) {
      return (
        <TranscriptViewer
          transcript={transcript}
          onSeek={onSeek}
          currentTime={currentTime}
          isAutoScrolling={true}
        />
      );
    }

    // User's chosen tab (either paused, or overriding during playback)
    switch (activeTab) {
      case "summary":
        return <SummaryView summary={summary} />;
      case "chat":
        return (
          <ChatPanel
            chatHistory={chatHistory}
            question={question}
            setQuestion={setQuestion}
            onAsk={onAsk}
            askingAI={askingAI}
          />
        );
      case "transcript":
        return (
          <TranscriptViewer
            transcript={transcript}
            onSeek={onSeek}
            currentTime={currentTime}
            isAutoScrolling={isPlaying}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-border-subtle">
        {getHeaderContent()}
      </div>

      {/* Panel Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default RightPanel;

