function TranscriptViewer({ transcript }) {
  if (!transcript || transcript.length === 0) {
    return <p>No transcript available</p>;
  }

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <h2>Transcript</h2>

      {transcript.map((item, index) => (
        <div key={index}>
          <strong>{formatTime(item.offset)}</strong>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export default TranscriptViewer;