import { useState } from "react";

function UrlForm({ onSubmit }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Paste YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "400px" }}
      />

      <button type="submit">
        Analyze
      </button>
    </form>
  );
}

export default UrlForm;