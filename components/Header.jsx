"use client";
import "./components.css";
import { usePrivy, useLogin } from "@privy-io/react-auth";

export default function Header() {
    const { login, logout, ready, authenticated } = usePrivy(); // Get authentication state

    const { login: loginUser } = useLogin({
        onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount }) => {
            
           
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
