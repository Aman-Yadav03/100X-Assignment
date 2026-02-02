import axios from "axios";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function sanitizeResponse(text) {
  if (!text) return "";

  return text
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function askLLM(userQuestion) {
  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: `
You are Aman Yadav.
Answer all questions in first person.
Tone: confident, thoughtful, and honest.
Keep responses natural and conversational.
            `,
          },
          { role: "user", content: userQuestion },
        ],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawText = response.data.choices[0].message.content;
    return sanitizeResponse(rawText);

  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    throw new Error("LLM request failed");
  }
}
