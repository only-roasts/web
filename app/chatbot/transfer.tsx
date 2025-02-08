import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { abi } from "./abi";
import { parseEther } from "viem";
import { useState, useEffect } from "react";

const CONTRACT_ADDRESS = "0x4b36621D45987Fcd3F70B3d81e6732BEB344631A";

export const useSendBaseToken = () => {
  const { data: hash, isPending, writeContract } = useWriteContract(); // ✅ Wagmi provides the hash
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash, // ✅ Wagmi's hash tracking
    });

  const sendBaseToken = async (recipient: string, amount: string) => {
    if (!recipient) {
      console.error("Recipient address required");
      return "❌ Recipient address required";
    }

    try {
      console.log("🚀 Sending transaction... Waiting for MetaMask confirmation...");

      // ✅ Initiate transaction (do NOT await)
      const tx = writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "transferFunds",
        args: [recipient],
        value: parseEther(amount),
      });

      if (!tx) {
        throw new Error("Transaction could not be created.");
      }

      console.log("📜 Transaction sent, waiting for MetaMask confirmation...");
      
      // ✅ Update state when hash is received
      setTransactionHash(hash || null);

      return `⏳ Transaction submitted! Waiting for confirmation... (Tx Hash: ${hash})`;
    } catch (error) {
      console.error("❌ Transaction error:", error);
      setErrorMessage("🚀 Sending transaction... Waiting for MetaMask confirmation..");
      return "🚀 Sending transaction... Waiting for MetaMask confirmation..";
    }
  };

  // ✅ Log when confirmed
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log(`✅ Transaction confirmed: ${hash}`);
      setTransactionHash(hash); // ✅ Ensure hash is set
    }
  }, [isConfirmed, hash]);

  return { sendBaseToken, isPending, isConfirming, isConfirmed, transactionHash, errorMessage };
};
