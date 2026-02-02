import axios from "axios";

const API_URL = `${process.env.REACT_APP_BASE_URL}/api/chat`;

export async function sendMessageToBot(message) {
  const response = await axios.post(API_URL, {
    message,
  });

  return response.data.reply;
}
