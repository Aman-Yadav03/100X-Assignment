import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

export async function sendMessageToBot(message) {
  const response = await axios.post(`${API_URL}/api/chat`, {
    message,
  });

  return response.data.reply;
}
