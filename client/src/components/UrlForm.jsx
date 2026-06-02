import { useState } from "react";

/**
 * UrlForm — URL input with analyze button.
 *
 * Props:
 *   onSubmit — (url: string) => void
 *   loading  — boolean
 */
function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url);
    }
  };

  return (
    <form
      className="flex gap-2 w-full max-w-xl"
      onSubmit={handleSubmit}
      id="url-form"
    >
      <input
        className="
          flex-1 px-4 py-2.5 bg-bg-input border border-border-subtle rounded-full
          text-text-primary font-[var(--font-body)] text-sm outline-none
          transition-all duration-150
          focus:border-olive focus:shadow-[0_0_0_3px_rgba(107,122,82,0.15)]
          placeholder:text-text-muted
        "
        type="text"
        placeholder="Paste a YouTube URL here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
        id="url-input"
      />

      <button
        className="
          inline-flex items-center justify-center gap-2
          px-5 py-2.5 border-none rounded-full
          font-[var(--font-body)] text-sm font-semibold cursor-pointer
          whitespace-nowrap transition-all duration-150
          bg-dark-brown text-paper-light
          hover:bg-dark-brown-light hover:shadow-md hover:-translate-y-0.5
          active:translate-y-0
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        "
        type="submit"
        disabled={loading || !url.trim()}
        id="analyze-btn"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          "▶ Analyze"
        )}
      </button>
    </form>
  );
}

export default UrlForm;