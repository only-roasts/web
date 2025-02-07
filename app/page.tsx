"use client";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { FaEthereum } from "react-icons/fa";
import { IoIosArrowDropright } from "react-icons/io";
import ConnectButton from "@/components/ConnectButton";
import Confetti from "react-confetti";
import Image from "next/image";
import { useEffect, useState } from "react";
import RoastCard from "@/components/RoastCard";
import { usePrivy } from "@privy-io/react-auth";
import PartnerPrizesComponent from "@/components/PartnerPrizesComponent";
import axios from "axios";
import { abi, address } from "@/lib/OnlyRoastNFTContract";
import { useReadContract } from "wagmi";

const roastData = [
  {
    roast: "You’ve spent more on gas fees than on your coffee this month! ☕",
    walletAddress: "0x1234567890",
    flameCount: 3,
  },
];

export default function LandingPage() {
  const { login, logout, ready, authenticated, user } = usePrivy(); // Get authentication state

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const tokenID = 0;

  const litCount = useReadContract({
    chainId: 84532,
    abi,
    address,
    functionName: "getLitCount",
    args: [BigInt(tokenID)],
  }).data;

  // setLitCount(litCount);

  const dropletCount = useReadContract({
    chainId: 84532,
    abi,
    address,
    functionName: "getDropCount",
    args: [BigInt(tokenID)],
  }).data;

  // setDropletCount(dropletCount);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    // Set initial size
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [ready, authenticated]);

  const { width, height } = windowSize;
  const [runConfetti, setRunConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRunConfetti(false);
    }, 5000);
  }, []);

  const gen = async () => {
    const genImageResponse = await axios.post("/api/generate-image", {
      roast: "You’ve spent more on gas fees than on your coffee this month! ☕",
      walletAddress: "0x1234567890",
      litCount: litCount?.toString(),
      dropletCount: dropletCount?.toString(),
    });

    const { pngBuffer } = genImageResponse.data;

    const uploadMetadataResponse = await axios.post("/api/upload-metadata", {
      pngBuffer,
      tokenID: 0,
    });

    const { cid } = uploadMetadataResponse.data;
  };

  return (
    <div className="flex flex-col items-center pt-5 pb-28">
      <Confetti width={width} height={height} recycle={runConfetti} />

      {/* Header */}
      <FaEthereum className="absolute w-72 h-72 inline-block left-[0px] text-gray-800  rotate-[-25deg] opacity-30" />
      <FaEthereum className="absolute w-96 h-96 inline-block right-[0] bottom-10 text-gray-800 z-0 rotate-[20deg] opacity-50" />

      <div className=" relative text-5xl text-[#FF5159] font-bold flex  mt-10  ml-5">
        <p>Only</p>
        <Flame className=" w-12 h-12 inline-block  " />
        <p>Roasts</p>
      </div>
      <p className="text-xl text-gray-700 mt-4  ml-5">
        Where Blockchain Meets Savage Humor
      </p>

      <h2 className="text-[40px] font-bold text-center text-gray-800 mt-10 uppercase tracking-wide ">
        Connect a Wallet to Get Roasted
      </h2>

      {/* Step Section */}
      <section className="mt-5 bg-white shadow-xl py-2 pl-3 pr-5 rounded-full  w-fit uppercase  tracking-wide mb-10">
        <div className="flex justify-evenly items-center gap-3">
          {/* Step 1 */}
          <div
            className={`flex items-center gap-2 ${
              authenticated ? "" : "opacity-50"
            }`}
          >
            <span className="flex justify-center items-center h-7 w-7 rounded-full bg-[#FF5159] text-white font-bold">
              1
            </span>
            <p className="text-gray-700 font-semibold text-sm">Link Wallets</p>
          </div>

          <IoIosArrowDropright className="w-7 h-7 opacity-50" />

          {/* Step 2 */}
          <div
            className={`flex items-center gap-2 ${
              authenticated ? "" : "opacity-50"
            }`}
          >
            <span className="flex justify-center items-center h-7 w-7 rounded-full bg-[#FF5159] text-white font-bold">
              2
            </span>
            <p className="text-gray-700 font-semibold text-sm">Get Roasted</p>
          </div>

          <IoIosArrowDropright className="w-7 h-7 opacity-50" />

          {/* Step 3 */}
          <div className="flex  items-center gap-2 opacity-50">
            <span className="flex justify-center items-center h-7 w-7 rounded-full bg-[#FF5159] text-white font-bold">
              3
            </span>
            <p className="text-gray-700 font-semibold text-sm">
              Share with Friends
            </p>
          </div>
        </div>
      </section>

      {authenticated ? (
        <RoastCard
          roast={roastData[0].roast}
          name={"YourName"}
          showButtons={true}
          walletAddress={user?.wallet?.address!}
          lit={roastData[0].flameCount}
          castOnWarpcast={() => {}}
          share={() => {}}
        />
      ) : (
        <ConnectButton />
      )}

      <button
        onClick={() => gen()}
        className="bg-[#FF5159] hover:bg-red-600 text-white mt-6 rounded-full px-6 py-2 shadow-lg"
      >
        Generate Roast
      </button>

      {/* <section className="text-center mt-16 max-w-xl">
        <h3 className="text-2xl font-bold text-[#FF5159]">
          Mint Your Roast as an NFT
        </h3>
        <p className="text-gray-700 mt-2">
          Share your savage roast on social media or create unique Farcaster
          frames for others to get their own roasts.
        </p>

        <Button className="bg-[#FF5159] hover:bg-red-600 text-white mt-6 rounded-full px-6 py-2 shadow-lg">
          Mint Now
        </Button>
      </section> */}

      <PartnerPrizesComponent />
      <footer className="text-center text-gray-500 text-sm fixed  z-10 bottom-5">
        Made with 🔥 by OnlyRoasts
      </footer>
    </div>
  );
}
