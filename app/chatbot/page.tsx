"use client";
import React, { useState, useEffect } from "react";
import "./Chatbox.css";
import axios from "axios";
import { FaEthereum } from "react-icons/fa";
import { useSendBaseToken } from "./transfer";
import ImageGenerator from "../venice/page";
import ConnectButton from "@/components/ConnectButton";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { sendBaseToken, transactionHash, isConfirmed } = useSendBaseToken(); 
  const [lastConfirmedHash, setLastConfirmedHash] = useState<string | null>(null);
  const [hasTransacted, setHasTransacted] = useState<boolean>(false); 

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Call backend API
    const response = await axios.get(`api/botinteraction/${userMessage.text}`);
    const ai_response = response.data.result.message;
    console.log(ai_response);

    if (response.data.result.tool) {
      const transaction_result = await sendBaseToken(
        response.data.result.tool.address,
        response.data.result.tool.amount
      );

      const aiMessage: Message = { text: transaction_result!, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } else {
      const aiMessage: Message = { text: ai_response, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    }

    setLoading(false);
  };

  
  useEffect(() => {
    if (isConfirmed && transactionHash && transactionHash !== lastConfirmedHash) {
      setLastConfirmedHash(transactionHash); 
      setHasTransacted(true); 
  
      const confirmedMessage: Message = {
        text: `✅ Transaction confirmed! Tx Hash: ${transactionHash}`,
        sender: "ai",
      };
      setMessages((prev) => [...prev, confirmedMessage]);
    }
  }, [isConfirmed, transactionHash]);

  return (
    <>
      <ConnectButton/>
      <div className="chat-container">
        <div className="chatbox">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
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

      
      {hasTransacted && (
        <div>
          <div className="secret-container">
            🎉 Congratulations! You have completed your first transaction! 🎉
          </div>
          <div className="secret-container claim">
            Now claim your character card based on your transactions
          </div>
          <ImageGenerator/>
        </div>
      )}
    </>
  );
};

export default Chatbox;
