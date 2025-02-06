"use client";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import axios from "axios";
import Image from "next/image";
import { Button } from "./ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConnectButton() {
  const { login, logout, ready, authenticated } = usePrivy(); // Get authentication state

  const fundNewUser = async (address: string) => {
    try {
      const response = await axios.post("/api/fundnewuser", {
        address: address,
      });
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const { login: loginUser } = useLogin({
    onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod }) => {
      console.log(user.wallet?.address); //debugging purposes
      if (isNewUser) {
        fundNewUser(user.wallet!.address);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (!ready) return <Skeleton className="w-[100px] h-[20px] rounded-full" />;

  return (
    <div className="">
      {!authenticated ? (
        <Button
          className="text-[#FF5159] bg-transparent border-[#FF5159] border hover:bg-[#FF5159] hover:text-white"
          onClick={login}
        >
          Login
        </Button>
      ) : (
        <Button onClick={logout}>Logout</Button>
      )}
    </div>
  );
}
