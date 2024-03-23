"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

const REACT_APP_GATEWAY_URL = "https://gateway.netsepio.com/";

const Navbar = () => {
  const wallet = Cookies.get("tarot_wallet");

  const [hovered, setHovered] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const logout = {
    color: hovered ? "red" : "black",
  };

  const getAptosWallet = () => {
    if ("aptos" in window) {
      return window.aptos;
    } else {
      window.open("https://petra.app/", "_blank");
    }
  };

  const connectWallet = async () => {
    const aptosWallet = getAptosWallet();
    try {
      const response = await aptosWallet.connect();
      console.log(response); // { address: string, publicKey: string }
      // Check the connected network
      const network = await aptosWallet.network();
      if (network === "Randomnet") {

        // signing message
        const payload = {
          message: "Hello from Aptos Tarot",
          nonce: Math.random().toString(16),
        };
        const res = await aptosWallet.signMessage(payload);
        // signing message

        Cookies.set("tarot_wallet", response.address, { expires: 7 });
        window.location.reload();
      } else {
        alert(`Switch to Randomnet in your Petra wallet`);
      }
    } catch (error) {
      console.error(error); // { code: 4001, message: "User rejected the request."}
    }
  };

  const handleDeleteCookie = () => {
    Cookies.remove("tarot_wallet");
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getRandomNumber = () => Math.floor(Math.random() * 1000);
        const apiUrl = `https://api.multiavatar.com/${getRandomNumber()}`;

        const response = await axios.get(apiUrl);
        const svgDataUri = `data:image/svg+xml,${encodeURIComponent(response.data)}`;
        setAvatarUrl(svgDataUri);
      } catch (error) {
        console.error('Error fetching avatar:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {wallet ? (
          <div className="flex gap-4">
          <Link href="/profile">{avatarUrl && <img src={avatarUrl} alt="Avatar" style={{width: 45}}/>} </Link>
          <div>
          <div className="ltext-black rounded-lg text-xl font-bold text-center">
            {wallet.slice(0, 4)}...{wallet.slice(-4)}
          </div>
          <button
            onClick={handleDeleteCookie}
            style={logout}
            className="mx-auto hover:text-red-400 text-black text-xl font-bold"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            Logout
          </button>
          </div>
          </div>
      ) : (
        <button onClick={connectWallet} className="py-2 px-5 font-bold text-xl">Connect wallet</button>
      )}
    </div>
  );
};

export default Navbar;
