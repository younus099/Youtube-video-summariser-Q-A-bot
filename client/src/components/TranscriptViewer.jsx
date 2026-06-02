import { useRef, useEffect, useMemo, useState, useCallback } from "react";

/**
 * TranscriptViewer — Displays transcript with smart auto-scroll.
 *
 * Auto-scroll follows the active segment during playback. If the user
 * manually scrolls away, auto-scroll pauses and a directional arrow
 * appears pointing toward the active line (↑ top or ↓ bottom).
 * Clicking it jumps back and resumes following.
 *
 * Props:
 *   transcript      — array of { text, offset (ms) }
 *   onSeek          — (seconds) => void — called when user clicks a timestamp
 *   currentTime     — number (seconds) — current video playback position
 *   isAutoScrolling — boolean — when true, auto-scroll to the active segment
 */
function TranscriptViewer({ transcript, onSeek, currentTime = 0, isAutoScrolling = false }) {
  const itemRefs = useRef([]);
  const containerRef = useRef(null);
  const [userPausedScroll, setUserPausedScroll] = useState(false);
  const [activeDirection, setActiveDirection] = useState(null); // "above" | "below" | null

  if (!transcript.length) return null;

  // Determine the active transcript index based on currentTime
  const activeIndex = useMemo(() => {
    if (!currentTime && currentTime !== 0) return -1;
    const timeSec = currentTime;
    let idx = -1;
    for (let i = 0; i < transcript.length; i++) {
      if (transcript[i].offset / 1000 <= timeSec) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [currentTime, transcript]);

  // Check where the active item is relative to the scroll viewport
  const updateDirection = useCallback(() => {
    if (activeIndex < 0 || !itemRefs.current[activeIndex]) {
      setActiveDirection(null);
      return;
    }

    const scrollContainer = containerRef.current?.closest(".overflow-y-auto");
    if (!scrollContainer) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const itemRect = itemRefs.current[activeIndex].getBoundingClientRect();

    if (itemRect.bottom < containerRect.top + 10) {
      setActiveDirection("above");
    } else if (itemRect.top > containerRect.bottom - 10) {
      setActiveDirection("below");
    } else {
      setActiveDirection(null);
    }
  }, [activeIndex]);

  // Reset user pause when isAutoScrolling prop changes (e.g., tab switch)
  useEffect(() => {
    setUserPausedScroll(false);
    setActiveDirection(null);
  }, [isAutoScrolling]);

  // Detect manual scrolling & update direction indicator
  useEffect(() => {
    const scrollContainer = containerRef.current?.closest(".overflow-y-auto");
    if (!scrollContainer || !isAutoScrolling) return;

    const handleUserScroll = () => {
      setUserPausedScroll(true);
    };

    const handleScroll = () => {
      if (userPausedScroll) {
        updateDirection();
      }
    };

    scrollContainer.addEventListener("wheel", handleUserScroll, { passive: true });
    scrollContainer.addEventListener("touchstart", handleUserScroll, { passive: true });
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("wheel", handleUserScroll);
      scrollContainer.removeEventListener("touchstart", handleUserScroll);
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [isAutoScrolling, userPausedScroll, updateDirection]);

  // Update direction when activeIndex changes while paused
  useEffect(() => {
    if (userPausedScroll) {
      updateDirection();
    }
  }, [activeIndex, userPausedScroll, updateDirection]);

  // Auto-scroll to active item (only if user hasn't manually scrolled)
  useEffect(() => {
    if (isAutoScrolling && !userPausedScroll && activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex, isAutoScrolling, userPausedScroll]);

  // Click arrow → jump to active line & resume following
  const handleJumpToActive = useCallback(() => {
    setUserPausedScroll(false);
    setActiveDirection(null);
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div ref={containerRef} className="flex flex-col relative" id="transcript-container">

      {/* ↑ Arrow — active line is above viewport */}
      {isAutoScrolling && userPausedScroll && activeDirection === "above" && (
        <div
          className="sticky top-0 z-10 flex justify-center py-1.5 pointer-events-none"
          style={{ marginBottom: "-2rem" }}
        >
          <button
            onClick={handleJumpToActive}
            className="
              pointer-events-auto
              flex items-center justify-center
              w-8 h-8 rounded-full
              bg-dark-brown/85 text-paper-light
              shadow-md backdrop-blur-sm
              cursor-pointer border-none
              hover:bg-dark-brown
              transition-all duration-200
              animate-fade-in
            "
            title="Jump to current position"
            id="scroll-indicator-up"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </div>
      )}

      {transcript.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            className={`
              flex gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-default
              ${isActive
                ? "bg-bg-active border-l-3 border-l-olive pl-3"
                : "hover:bg-bg-card-hover"
              }
            `}
          >
            <span
              className={`
                font-mono text-xs whitespace-nowrap pt-0.5 font-medium cursor-pointer
                transition-colors duration-150 shrink-0
                ${isActive ? "text-olive font-semibold" : "text-text-accent hover:text-olive-dark hover:underline"}
              `}
              onClick={() => onSeek(Math.floor(item.offset / 1000))}
              title="Click to jump to this point"
            >
              {formatTime(item.offset)}
            </span>
            <span
              className={`
                text-sm leading-relaxed
                ${isActive ? "text-text-primary font-medium" : "text-text-secondary"}
              `}
            >
              {item.text}
            </span>
          </div>
        );
      })}

      {/* ↓ Arrow — active line is below viewport */}
      {isAutoScrolling && userPausedScroll && activeDirection === "below" && (
        <div
          className="sticky bottom-0 z-10 flex justify-center py-1.5 pointer-events-none"
          style={{ marginTop: "-2rem" }}
        >
          <button
            onClick={handleJumpToActive}
            className="
              pointer-events-auto
              flex items-center justify-center
              w-8 h-8 rounded-full
              bg-dark-brown/85 text-paper-light
              shadow-md backdrop-blur-sm
              cursor-pointer border-none
              hover:bg-dark-brown
              transition-all duration-200
              animate-fade-in
            "
            title="Jump to current position"
            id="scroll-indicator-down"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default TranscriptViewer;