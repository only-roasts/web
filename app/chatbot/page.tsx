"use client";
import React, { useState, useEffect } from "react";
import "./Chatbox.css";
import axios from "axios";
import { FaEthereum } from "react-icons/fa";
import { useSendBaseToken } from "./transfer";
import ImageGenerator from "../venice/page";
import ConnectButton from "@/components/ConnectButton";
import { Flame } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { sendBaseToken, transactionHash, isConfirmed } = useSendBaseToken();
  const [lastConfirmedHash, setLastConfirmedHash] = useState<string | null>(
    null
  );
  const [hasTransacted, setHasTransacted] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false); // ✅ New state for modal

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
    if (
      isConfirmed &&
      transactionHash &&
      transactionHash !== lastConfirmedHash
    ) {
      setLastConfirmedHash(transactionHash);
      setHasTransacted(true);
      setShowPopup(true); // ✅ Show the popup when transaction is confirmed

      const confirmedMessage: Message = {
        text: `✅ Transaction confirmed! Tx Hash: ${transactionHash}`,
        sender: "ai",
      };
      setMessages((prev) => [...prev, confirmedMessage]);
    }
  }, [isConfirmed, transactionHash]);

  return (
    <div className="px-12 flex flex-col items-center">
      <ConnectButton />
      <div className=" relative text-5xl text-[#FF5159] font-bold flex  mt-10  ml-5">
        <p>Only</p>
        <Flame className=" w-12 h-12 inline-block  " />
        <p>Roasts</p>
      </div>
      <p className="text-xl text-gray-700 mt-4  ml-5 title titlename">
        Where Blockchain Meets Savage Humor
      </p>

      <h2 className="text-[40px] font-bold text-center text-gray-800 mt-10 uppercase tracking-wide ">
        Do your First Transaction to get your own Character card based on your
        transaction
      </h2>
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

      {/* ✅ Popup Modal for Claiming Character */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You have completed your first transaction!</p>
            <p>Now claim your character card based on your transactions.</p>
            <ImageGenerator />
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
