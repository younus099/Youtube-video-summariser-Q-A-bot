import { useRef, useEffect } from "react";

/**
 * ChatPanel — Full-height Q&A chat interface.
 *
 * Props:
 *   chatHistory — array of { role: "user"|"ai", text: string }
 *   question    — string (controlled input value)
 *   setQuestion — (value: string) => void
 *   onAsk       — () => void — called when user sends a question
 *   askingAI    — boolean — loading state
 */
function ChatPanel({ chatHistory, question, setQuestion, onAsk, askingAI }) {
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, askingAI]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAsk();
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div className="w-1 h-5 bg-olive rounded-full" />
        <h3 className="font-heading text-base font-semibold text-text-primary">
          Ask About This Video
        </h3>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 mb-3 pr-1"
        id="chat-messages"
      >
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted text-sm">
            <div className="text-4xl mb-3 opacity-40">💬</div>
            <p>Ask anything about the video</p>
            <p className="text-xs mt-1 text-text-muted">The AI has access to the full transcript</p>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`
              px-3.5 py-2.5 rounded-xl text-sm leading-relaxed animate-fade-slide-up
              ${msg.role === "user"
                ? "bg-olive/10 border border-olive/20 self-end max-w-[85%] text-text-primary"
                : "bg-bg-card border border-border-subtle self-start max-w-[95%] text-text-secondary whitespace-pre-wrap"
              }
            `}
          >
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider mb-1 text-text-muted">
              {msg.role === "user" ? "You" : "AI"}
            </div>
            {msg.text}
          </div>
        ))}

        {askingAI && (
          <div className="bg-bg-card border border-border-subtle self-start max-w-[95%] px-3.5 py-2.5 rounded-xl text-sm animate-fade-slide-up">
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider mb-1 text-text-muted">
              AI
            </div>
            <div className="flex gap-1 items-center py-2">
              <div className="typing-dot" />
              <div className="typing-dot typing-dot-delay-1" />
              <div className="typing-dot typing-dot-delay-2" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Row */}
      <div className="flex gap-2 items-center shrink-0">
        <input
          className="
            flex-1 px-4 py-2.5 bg-bg-input border border-border-subtle rounded-full
            text-text-primary font-[var(--font-body)] text-sm outline-none
            transition-all duration-150
            focus:border-olive focus:shadow-[0_0_0_3px_rgba(107,122,82,0.15)]
            placeholder:text-text-muted
          "
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          disabled={askingAI}
          id="qa-question-input"
        />
        <button
          className="
            w-10 h-10 rounded-full bg-olive text-white border-none cursor-pointer
            flex items-center justify-center transition-all duration-150 shrink-0
            hover:bg-olive-dark hover:shadow-md hover:scale-105
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
          "
          onClick={onAsk}
          disabled={askingAI || !question.trim()}
          title="Send question"
          id="qa-send-btn"
        >
          {askingAI ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M3.105 2.29a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95l14.095-5.638a.75.75 0 000-1.394L3.105 2.289z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
