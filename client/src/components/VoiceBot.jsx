import React, { useState, useRef } from "react";
import { sendMessageToBot } from "../services/api";
import "./VoiceBot.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.lang = "en-IN";
  recognition.interimResults = false;
}

function VoiceBot() {
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [botText, setBotText] = useState("");
  const [loading, setLoading] = useState(false);
const [isSpeaking, setIsSpeaking] = useState(false);
const utteranceRef = useRef(null);

  // const synthRef = useRef(window.speechSynthesis);
  const isRecognizingRef = useRef(false);

  const speak = (text) => {
  if (!window.speechSynthesis) return;

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";

  utterance.onstart = () => {
    setIsSpeaking(true);
  };

  utterance.onend = () => {
    setIsSpeaking(false);
  };

  utterance.onerror = () => {
    setIsSpeaking(false);
  };

  utteranceRef.current = utterance;
  window.speechSynthesis.speak(utterance);
};
const pauseSpeech = () => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
};

const resumeSpeech = () => {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
};


 const startListening = () => {
  if (!recognition) {
    alert("Speech Recognition not supported in this browser");
    return;
  }

  // 🚫 Prevent multiple starts
  if (isRecognizingRef.current) {
    return;
  }

  setListening(true);
  isRecognizingRef.current = true;

  recognition.start();

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    setUserText(transcript);
    setListening(false);
    setLoading(true);

    try {
      const reply = await sendMessageToBot(transcript);
      setBotText(reply);
      speak(reply);
    } catch (err) {
      setBotText("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  recognition.onend = () => {
    isRecognizingRef.current = false;
    setListening(false);
  };

  recognition.onerror = () => {
    isRecognizingRef.current = false;
    setListening(false);
    alert("Voice recognition error. Try again.");
  };
};


  return (
    <div className="voicebot-container">
      <h1>🎙️ Voice Bot</h1>
      <p className="subtitle">
        Ask me anything about my life, skills, or growth journey.
      </p>

      <button
        className={`mic-btn ${listening ? "listening" : ""}`}
        onClick={startListening}
        disabled={loading}
      >
        {listening ? "Listening..." : "🎤 Speak"}
      </button>
      {isSpeaking && (
  <div className="speech-controls">
    <button onClick={pauseSpeech}>⏸️ Pause</button>
    <button onClick={resumeSpeech}>▶️ Resume</button>
  </div>
)}


      {userText && (
        <div className="card user">
          <strong>You:</strong> {userText}
        </div>
      )}

      {loading && <p className="loading">Thinking...</p>}

      {botText && (
        <div className="card bot">
          <strong>Aman:</strong> {botText}
        </div>
      )}
    </div>
  );
}

export default VoiceBot;
