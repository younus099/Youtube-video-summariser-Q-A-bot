import { GoogleGenerativeAI } from "@google/generative-ai";


export const generateSummary = async (text) => {

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite"
  });

  const prompt = `
Summarize the following YouTube transcript clearly.

Give:
1. Short Summary
2. Key Points
3. Main Topics

Transcript:
${text}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};