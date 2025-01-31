"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Share2, Zap, Copy, Droplet } from "lucide-react"; // Added Droplet for water icon
import { motion } from "framer-motion";
import { Bangers } from "next/font/google";
import Image from "next/image";

interface RoastCardProps {
  roast: string;
  name: string;
  showButtons: boolean;
  walletAddress: string;
  mintNFT: () => void;
  castOnWarpcast: () => void;
  share: () => void;
  lit: number; // Added lit prop to the interface
}

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
});

const RoastCard: React.FC<RoastCardProps> = ({
  roast,
  showButtons,
  walletAddress,
  mintNFT,
  castOnWarpcast,
  share,
  lit,
}) => {
  const shortenAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied to clipboard!");
  };

  // Render flames based on the 'lit' value
  const renderFlames = () => {
    const flamesArray = [];
    for (let i = 0; i < lit; i++) {
      flamesArray.push(
        <div
          key={i}
          className={`absolute opacity-30 top-[${120 + i * 10}px] left-[${
            120 + i * 20
          }px] z-0`}
        >
          <Image
            src="/flame1.png"
            alt="Flames"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
      );
    }
    return flamesArray;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Card className="relative w-[250px] sm:w-[300px] md:w-[320px] bg-white border  shadow-lg rounded-lg overflow-hidden transform perspective-1000 hover:rotate-1 hover:scale-105 transition-transform duration-500">
        {/* Render flames based on the 'lit' value */}
        {renderFlames()}

        <CardContent className="relative p-3 sm:p-4 text-center z-10">
          {/* Roastee name */}
          <div className="flex justify-between items-center mb-3 border pr-3 rounded-lg bg-[#ffffffaa]">
            <Image
              src="/logo.png"
              alt="OnlyRoasts Logo"
              height={80}
              width={80}
              className="object-cover"
            />

            <div className="flex items-center gap-1">
              <p>{shortenAddress(walletAddress)}</p>

              <Button
                onClick={copyToClipboard}
                className="bg-transparent text-black hover:bg-gray-100 rounded-xl border-none shadow-none px-3 "
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Roast text with text shadow */}

          <motion.div
            className={`text-base sm:text-xl bg-[#fff] text-black text-start py-3 ${bangers.className}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            &quot; {roast} &quot;
          </motion.div>

          {showButtons ? (
            <div className="mt-4 sm:mt-5 flex justify-around space-x-3 overflow-x-auto hide-scrollbar py-3">
              <Button
                onClick={mintNFT}
                className="bg-gray-600 hover:bg-gray-700 text-white rounded-xl py-1.5 sm:py-2 px-3 sm:px-4 flex items-center gap-2 shadow-lg transform hover:translate-y-[-10px] transition-transform"
              >
                <Zap className="w-5 h-5" />
                Mint as NFT
              </Button>
              <Button
                onClick={castOnWarpcast}
                className="bg-gray-600 hover:bg-gray-700 text-white rounded-xl py-1.5 sm:py-2 px-3 sm:px-4 flex items-center gap-2 shadow-lg transform hover:translate-y-[-10px] transition-transform"
              >
                <Flame className="w-5 h-5" />
                Cast on Warpcast
              </Button>
              <Button
                onClick={share}
                className="bg-gray-600 hover:bg-gray-700 text-white rounded-xl py-1.5 sm:py-2 px-3 sm:px-4 flex items-center gap-2 shadow-lg transform hover:translate-y-[-10px] transition-transform"
              >
                <Share2 className="w-5 h-5" />
                Share
              </Button>
            </div>
          ) : (
            <div className="flex justify-around mt-3 gap-3">
              <Button className="flex-1 border-red-500 bg-white border text-red-500 hover:bg-red-400 hover:text-black hover:scale-105 transition-all duration-300  py-2 rounded-xl shadow-lg">
                <Flame className="w-5 h-5" />
              </Button>
              <Button className="flex-1 border-blue-500 bg-white border text-blue-500 hover:bg-blue-300 hover:text-black hover:scale-105 transition-all duration-300 py-2 rounded-xl shadow-lg">
                <Droplet className="w-5 h-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoastCard;
