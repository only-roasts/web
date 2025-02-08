"use client";
import React, { useState, useEffect } from "react";
import "./Chatbox.css";
import axios from "axios";
import { FaEthereum } from "react-icons/fa";
import { useSendBaseToken } from "./transfer";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { sendBaseToken, transactionHash, isConfirmed } = useSendBaseToken(); // ✅ Track transaction status
  const [lastConfirmedHash, setLastConfirmedHash] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Call backend API
    const response = await axios.get(`api/botinteraction/${userMessage.text}`);
    const ai_response = response.data.result.message;

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

  // ✅ Once transaction is confirmed, update chat
  useEffect(() => {
    if (isConfirmed && transactionHash && transactionHash !== lastConfirmedHash) {
      setLastConfirmedHash(transactionHash); // ✅ Store the last confirmed transaction
  
      const confirmedMessage: Message = {
        text: `✅ Transaction confirmed! Tx Hash: ${transactionHash}`,
        sender: "ai",
      };
      setMessages((prev) => [...prev, confirmedMessage]);
    }
  }, [isConfirmed, transactionHash]);

  return (
    <>
      <FaEthereum className="absolute w-72 h-72 inline-block left-[0px] text-gray-800 rotate-[-25deg] opacity-30" />
      <FaEthereum className="absolute w-96 h-96 inline-block right-[0] bottom-10 text-gray-800 z-0 rotate-[20deg] opacity-50" />
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
    </>
  );
};

export default Chatbox;
