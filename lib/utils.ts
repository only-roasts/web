import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
