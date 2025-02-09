"use client";
/* eslint-disable no-unused-vars */

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
import {
  getPinataMetadataCID,
  getRoastData,
} from "./api/posting-reply-for-mention/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function LandingPage() {
  const { login, logout, ready, authenticated, user } = usePrivy(); // Get authentication state

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const [cid, setCID] = useState("");

  const [roastGenrationStarted, setRoastGenerationStarted] = useState(false);
  const [roastData, setRoastData] = useState<
    | {
        roast: any;
        walletAddress: string;
        flameCount: number;
        litCount: number;
        dropletCount: number;
      }
    | undefined
  >(undefined);
  const [tokenId, setTokenID] = useState(0);

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
    setRoastGenerationStarted(true);

    const { cid, roastData, tokenId } = await getPinataMetadataCID(
      user?.wallet?.address!
    );
    setCID(cid);
    setTokenID(tokenId);
    const roastNFTData = {
      walletStatus: "Defi Degenerate",
      ethSpent: 0,
      roast: roastData.roast,
      intensity: "Mild",
      advice: " You should probably stop wasting your money on gas fees.",
    };

    setRoastData(roastData);
  };

  return (
    <div className="flex flex-col items-center pt-5 pb-28">
      {roastData?.roast && (
        <Confetti width={width} height={height} recycle={runConfetti} />
      )}
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

      <div className="flex items-center gap-2 mt-5">
        <p>First Time To Web3? </p>
        <Link
          href={"/chatbot"}
          target="_blank"
          className="text-[#FF5159] underline"
        >
          Check our Chatbot
        </Link>
      </div>

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
        <button
          onClick={() => logout()}
          className="bg-[#FF5159] hover:bg-red-600 text-white mt-6 rounded-full px-6 py-2 shadow-lg mb-10"
        >
          Logout{" "}
        </button>
      ) : (
        <ConnectButton />
      )}

      {roastGenrationStarted && roastData == undefined && (
        <div className=" h-[280px] w-[320px] flex flex-col justify-between border rounded-lg p-4">
          <Skeleton className="h-12 w-full mb-3 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="mt-5 flex justify-around  gap-3">
            <Skeleton className="h-8 flex-1 rounded-xl" />
            <Skeleton className="h-8 flex-1 rounded-xl" />
          </div>
        </div>
      )}

      {roastData?.roast && (
        <RoastCard
          roast={roastData?.roast}
          showButtons={true}
          walletAddress={user?.wallet?.address!}
          lit={3}
          tokenId={tokenId}
          cid={cid}
        />
      )}

      {authenticated && (
        <button
          onClick={() => gen()}
          className="bg-[#FF5159] hover:bg-red-600 text-white mt-6 rounded-full px-6 py-2 shadow-lg"
        >
          Generate Roast
        </button>
      )}

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
