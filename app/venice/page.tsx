"use client";
import axios from "axios";
import { useState } from "react";
import { useWallets } from "@privy-io/react-auth"; // ✅ Import useWallets
import "./venice.css";
import "dotenv/config";

const ImageGenerator = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { wallets, ready } = useWallets(); // ✅ Get connected wallets

  const generateImage = async () => {
    setLoading(true);

    if (!ready || wallets.length === 0) {
      console.error("❌ No wallet connected or still loading...");
      setLoading(false);
      return;
    }

    const wallet = wallets[0]; 
    const userAddress = wallet.address; 

    try {
      const response = await axios.post("/api/gettransaction", { address: userAddress });
      const transactiondetail = response.data.transactiondetail;
      const promptResponse = await axios.post("/api/generatecharacter", { transaction: transactiondetail });

      console.log(promptResponse.data.res);
      const promptToVenice = promptResponse.data.res;

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_VENICE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "stable-diffusion-3.5",
          prompt: promptToVenice,
          return_binary: false,
          style_preset: "GTA",
          hide_watermark: true,
        }),
      };

      const responseImage = await fetch("https://api.venice.ai/api/v1/image/generate", options);
      const data = await responseImage.json();

      if (data.images && data.images.length > 0) {
        setImageData(`data:image/png;base64,${data.images[0]}`);
      } else {
        console.error("Image generation failed", data);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }

    setLoading(false);
  };

  const downloadImage = () => {
    if (!imageData) return;

    const link = document.createElement("a");
    link.href = imageData;
    link.download = "generated_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="text-center">
      <button 
        onClick={generateImage} 
        className="generate text-white p-2 rounded"
        disabled={loading} 
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {loading && <p className="mt-4 text-gray-500">⏳ Please wait, generating image...</p>}

      {imageData && !loading && (
        <div className="mt-4">
          <img src={imageData} alt="Generated" className="w-full max-w-md mx-auto rounded shadow" />
          <button 
            onClick={downloadImage} 
            className="bg-green-500 text-white p-2 rounded mt-2"
          >
            Download Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
