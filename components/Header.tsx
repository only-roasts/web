"use client";
import "./components.css";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import axios from "axios";

export default function Header() {
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
      console.log(user.wallet!.address); //debugging purposes
      if (isNewUser) {
        fundNewUser(user.wallet!.address);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (!ready) return null;

  return (
    <div className="header">
      {!authenticated ? (
        <div onClick={login}>Login</div>
      ) : (
        <div onClick={logout}>Logout</div>
      )}
    </div>
  );
}
