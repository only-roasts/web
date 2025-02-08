"use client";
import { useState } from "react";
import { useWriteContract, useReadContract } from "wagmi";
import { abi } from "../abi";
import { parseEther } from "viem";

const CONTRACT_ADDRESS = "0x4b36621D45987Fcd3F70B3d81e6732BEB344631A";

export default function ContractFunctions() {
  const { writeContract } = useWriteContract();
  const [erc20Balance, setErc20Balance] = useState<string | null>(null);
  const [swapEstimate, setSwapEstimate] = useState<string | null>(null);

  /* Fetch Contract Balance */
  const { data: contractBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getContractBalance",
  });

  /* Send Native Token */
  const sendBaseToken = async (recipient: string, amount: string) => {
    if (!recipient) return console.error("Recipient address required");

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "transferFunds",
        args: [recipient],
        value: parseEther(amount),
      });

      console.log(`Sent ${amount} ETH to ${recipient}`);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  /*Transfer ERC20 Token */
  const transferERC20 = async (tokenAddress: string, recipient: string, amount: string) => {
    if (!recipient) return console.error("Recipient address required");

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "transferERC20",
        args: [tokenAddress, recipient, parseEther(amount)],
      });

      console.log(`Sent ${amount} ERC20 tokens to ${recipient}`);
    } catch (error) {
      console.error("ERC20 Transfer failed:", error);
    }
  };

  /*Approve ERC20 */
  const approveERC20 = async (tokenAddress: string, spender: string, amount: string) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "approveERC20",
        args: [tokenAddress, spender, parseEther(amount)],
      });

      console.log(`Approved ${amount} ERC20 tokens for spender ${spender}`);
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  /* Swap Tokens */
  const swapTokens = async (tokenIn: string, tokenOut: string, amountIn: string, amountOutMin: string) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "swapTokens",
        args: [tokenIn, tokenOut, parseEther(amountIn), parseEther(amountOutMin)],
      });

      console.log(`Swapped ${amountIn} ${tokenIn} for ${tokenOut}`);
    } catch (error) {
      console.error("Swap failed:", error);
    }
  };

  /* Get ERC20 Balance */
  const getERC20Balance = async (tokenAddress: string, user: string) => {
    try {
      const balance = await useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "getERC20Balance",
        args: [tokenAddress, user],
      });

      setErc20Balance(balance.toString());
      console.log(`ERC20 Balance: ${balance}`);
    } catch (error) {
      console.error("Balance fetch failed:", error);
    }
  };

  /* Get Expected Swap Amount */
  const getExpectedSwapAmount = async (tokenIn: string, tokenOut: string, amountIn: string) => {
    try {
      const swapAmount = await useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "getExpectedSwapAmount",
        args: [tokenIn, tokenOut, parseEther(amountIn)],
      });

      setSwapEstimate(swapAmount.toString());
      console.log(`Expected Swap Output: ${swapAmount}`);
    } catch (error) {
      console.error("Failed to fetch swap amount:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Contract Functions</h2>

      {/* Send Native Token */}
      <button onClick={() => sendBaseToken("0xRecipientAddress", "0.001")} style={{ margin: "5px", padding: "10px" }}>
        Send Base Token
      </button>

      {/* Transfer ERC20 Token */}
      <button onClick={() => transferERC20("0xTokenAddress", "0xRecipientAddress", "10")} style={{ margin: "5px", padding: "10px" }}>
        Transfer ERC20
      </button>

      {/* Approve ERC20 */}
      <button onClick={() => approveERC20("0xTokenAddress", "0xSpenderAddress", "100")} style={{ margin: "5px", padding: "10px" }}>
        Approve ERC20
      </button>

      {/* Swap Tokens */}
      <button onClick={() => swapTokens("0xTokenIn", "0xTokenOut", "10", "9")} style={{ margin: "5px", padding: "10px" }}>
        Swap Tokens
      </button>

      {/* Get Contract Balance */}
      <button onClick={refetchBalance} style={{ margin: "5px", padding: "10px" }}>
        Refresh Contract Balance
      </button>
      <p>Contract Balance: {contractBalance ? `${contractBalance} ETH` : "Loading..."}</p>

      {/* Get ERC20 Balance */}
      <button onClick={() => getERC20Balance("0xTokenAddress", "0xUserAddress")} style={{ margin: "5px", padding: "10px" }}>
        Get ERC20 Balance
      </button>
      <p>ERC20 Balance: {erc20Balance !== null ? `${erc20Balance} Tokens` : "N/A"}</p>

      {/* Get Expected Swap Amount */}
      <button onClick={() => getExpectedSwapAmount("0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD", "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1", "1")} style={{ margin: "5px", padding: "10px" }}>
        Get Expected Swap Amount
      </button>
      <p>Expected Swap Amount: {swapEstimate !== null ? `${swapEstimate} Tokens` : "N/A"}</p>
    </div>
  );
}
