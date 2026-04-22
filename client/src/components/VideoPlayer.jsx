function VideoPlayer({ videoId }) {
  return (
    <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube Video"
      allowFullScreen
    />
  );
}

export default VideoPlayer;