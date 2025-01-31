"use client";

import { useState } from "react";
import axios from "axios";
import RoastCard from "@/components/RoastCard";
import Image from "next/image";

export default function Home() {
  const [imageURL, setImageURL] = useState("");
  const [jsonURL, setJsonURL] = useState("");
  // const [uploading, setUploading] = useState(false);

  const roastData = [
    {
      roast: "You’ve spent more on gas fees than on your coffee this month! ☕",
      walletAddress: "0x1234567890",
      flameCount: 3,
    },
  ];

  const getRoastImage = async (
    roast: string,
    walletAddress: string,
    flameCount: number
  ) => {
    try {
      const response = await axios.post("/api/generate-image", {
        roast,
        walletAddress,
        flameCount,
      });

      const { image } = response.data;
      return image;
    } catch (e) {
      console.log(e);
      alert("Trouble generating image");
    }
  };

  const mintNFT = async () => {
    try {
      //setUploading(true);
      const roastImage = await getRoastImage(
        roastData[0].roast,
        roastData[0].walletAddress,
        roastData[0].flameCount
      );

      setImageURL(roastImage);
      // const response = await axios.post("/api/files", {
      //   roastImage,
      // });

      // const { image, json } = response.data;
      // setImageURL(image);
      setJsonURL("");
      //setUploading(false);
    } catch (e) {
      console.log(e);
      //setUploading(false);
      alert("Trouble uploading file");
    }
  };

  console.log(imageURL);

  return (
    <main className="w-full min-h-screen m-auto  flex flex-col justify-center items-center">
      <RoastCard
        roast={roastData[0].roast}
        name="YourName"
        showButtons={true}
        walletAddress={roastData[0].walletAddress}
        lit={roastData[0].flameCount}
        mintNFT={mintNFT}
        castOnWarpcast={() => {}}
        share={() => {}}
      />
      {imageURL && (
        <Image
          src={`data:image/png;base64,${imageURL}`}
          alt="Image from Pinata IPFS"
          className="w-1/2 h-1/2"
        />
      )}

      {jsonURL && (
        <a
          href={jsonURL}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500"
        >
          View JSON
        </a>
      )}
    </main>
  );
}
