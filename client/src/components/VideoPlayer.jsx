import { useEffect, useRef, useCallback } from "react";

/**
 * VideoPlayer — Uses YouTube IFrame Player API for play/pause detection.
 *
 * Props:
 *   videoId            — YouTube video ID string
 *   seekTime           — number (seconds) to seek to when changed
 *   onPlayStateChange  — (isPlaying: boolean) => void
 *   onTimeUpdate       — (currentTimeSec: number) => void
 */
function VideoPlayer({ videoId, seekTime, onPlayStateChange, onTimeUpdate }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const timerRef = useRef(null);
  const prevVideoIdRef = useRef(null);

  // Polling loop: track current playback time
  const startTimeTracking = useCallback(() => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current);

    const tick = () => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        const t = playerRef.current.getCurrentTime();
        onTimeUpdate?.(t);
      }
      timerRef.current = requestAnimationFrame(tick);
    };
    timerRef.current = requestAnimationFrame(tick);
  }, [onTimeUpdate]);

  const stopTimeTracking = useCallback(() => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Load YT IFrame API script if not already loaded
  useEffect(() => {
    if (window.YT && window.YT.Player) return; // already loaded

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(tag, firstScript);
  }, []);

  // Create or re-create player when videoId changes
  useEffect(() => {
    if (!videoId) return;
    if (prevVideoIdRef.current === videoId) return;
    prevVideoIdRef.current = videoId;

    const createPlayer = () => {
      // Destroy existing player
      if (playerRef.current) {
        stopTimeTracking();
        playerRef.current.destroy();
        playerRef.current = null;
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event) => {
            const state = event.data;
            if (state === window.YT.PlayerState.PLAYING) {
              onPlayStateChange?.(true);
              startTimeTracking();
            } else if (
              state === window.YT.PlayerState.PAUSED ||
              state === window.YT.PlayerState.ENDED
            ) {
              onPlayStateChange?.(false);
              stopTimeTracking();
            } else if (state === window.YT.PlayerState.BUFFERING) {
              // Buffering is transient — stop time tracking but don't
              // signal a play-state change (avoids tab-revert flicker)
              stopTimeTracking();
            }
          },
        },
      });
    };

    // If YT API is already ready, create immediately
    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      // Wait for API to be ready
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
    }

    return () => {
      stopTimeTracking();
    };
  }, [videoId, onPlayStateChange, startTimeTracking, stopTimeTracking]);

  // Handle seekTime changes
  useEffect(() => {
    if (
      playerRef.current &&
      typeof playerRef.current.seekTo === "function" &&
      seekTime !== undefined &&
      seekTime !== null
    ) {
      playerRef.current.seekTo(seekTime, true);
    }
  }, [seekTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimeTracking();
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [stopTimeTracking]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border-subtle shadow-lg bg-paper-dark video-aspect">
      <div
        ref={containerRef}
        id="yt-player-container"
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
}

export default VideoPlayer;