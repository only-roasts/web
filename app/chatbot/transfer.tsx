import { useState, useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers"; // ✅ Import ethers for provider wrapping
import { parseEther } from "viem";

const CONTRACT_ADDRESS = "0x4b36621D45987Fcd3F70B3d81e6732BEB344631A";
export const useSendBaseToken = () => {
  const { wallets, ready } = useWallets();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const sendBaseToken = async (recipient: string, amount: string) => {
    if (!recipient) return "❌ Recipient address required";
    if (!ready) return "❌ Wallets are still loading, please wait...";

    const wallet = wallets[0];
    if (!wallet) return "❌ No wallet connected!";

    try {
      console.log(`🚀 Sending transaction using ${wallet.walletClientType} wallet...`);
      const provider = await wallet.getEthereumProvider();
      if (!provider) throw new Error("Ethereum provider not found!");

      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();

      const tx = await signer.sendTransaction({
        to: recipient,
        value: parseEther(amount),
      });

      console.log("📜 Transaction submitted:", tx.hash);
      setTransactionHash(tx.hash);
      setIsConfirming(true);

      
      await tx.wait();
      setIsConfirming(false);
      setIsConfirmed(true);

     

      return null; // 
    } catch (error) {
      console.error("❌ Transaction error:", error);
      setErrorMessage("🚀 Error processing transaction");
      return "🚀 Error processing transaction";
    }
  };

  return { sendBaseToken, isPending: !ready, isConfirming, isConfirmed, transactionHash, errorMessage };
};
