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

  if (!ready)
    return (
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
    );

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
