import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useReadContract } from "wagmi";
import { abi, address } from "@/lib/OnlyRoastNFTContract";

export const getWebURL = () => {
  return process.env.ENVIRONMENT == "development"
    ? process.env.NEXT_DEV_WEB_URL
    : process.env.NEXT_PROD_WEB_URL;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const copyToClipboard = (walletAddress: string) => {
  navigator.clipboard.writeText(walletAddress);
  alert("Wallet address copied to clipboard!");
};
