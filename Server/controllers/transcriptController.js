import { fetchTranscript } from "youtube-transcript/dist/youtube-transcript.esm.js";
import { extractVideoId } from "../utils/extractVideoId.js";
import { generateSummary } from "../services/geminiService.js";

export const getTranscript = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required"
      });
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Invalid YouTube URL"
      });
    }

    const transcript = await fetchTranscript(videoId);

    const fullText = transcript
      .map(item => item.text)
      .join(" ");

    const summary = await generateSummary(fullText);
    // const summary = "test summary";
    res.json({
      success: true,
      videoId,
      transcript,
      summary
    });

  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: error.message || "Transcript not available"
    // });
    console.error("SERVER ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack
  });

  }
};