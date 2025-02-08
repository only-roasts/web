"use client";
import React, { useState } from "react";
import "./Chatbox.css";
import { get_data_from_covalent } from "./botinteractions";
import axios from "axios";
interface Message {
  text: string;
  sender: "user" | "ai";
}

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); 

  const sendMessage = async () => {
    if (!input.trim() || loading) return; 
    setLoading(true);

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // call to covalent

      const response=await axios.get(`api/botinteraction/${userMessage.text}`)
      const ai_response=response.data.result.message;
      const aiMessage: Message = { text:ai_response , sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false); 
    }
  

  return (
    <div className="chat-container">
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>{msg.text}</div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading} 
        />
        <button onClick={sendMessage} disabled={loading}> 
          {loading ? "Waiting..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
