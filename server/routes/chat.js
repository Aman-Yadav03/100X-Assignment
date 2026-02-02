import express from "express";
import { askLLM } from "../services/llm.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await askLLM(message);

    res.json({ reply });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "LLM failed" });
  }
});

export default router;
