import { GoogleGenerativeAI } from "@google/generative-ai";


export const askQuestion = async (req, res) => {
  try {
    const { question, transcript } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    const prompt = `
    Use only the transcript below.
    
    If answer exists:
    1. Answer clearly
    2. Mention relevant timestamp(s)
    
    If not found:
    Say not found.
    
    Transcript:
    ${transcript}
    
    Question:
    ${question}
    `;

    const result = await model.generateContent(prompt);

    res.json({
      success: true,
      answer: result.response.text()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};