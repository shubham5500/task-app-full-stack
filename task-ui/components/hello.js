"use client";
import React, { useState } from "react";

const Hello = () => {
  const [profile, setProfile] = useState(null);
  const getProfile = async () => {
    const token = localStorage.getItem("myToken");
    try {
      const res = await fetch("http://localhost:3000/users/profile", {
        method: "GET",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        const result = await res.json();
        return result;
      } else {
        console.log("AYA");
      }
    } catch (error) {}
  };

  const refreshToken = async () => {
    const res = await fetch("http://localhost:3000/auth/refresh-token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const result = await res.json();
    console.log("========>", result);
    localStorage.setItem("myToken", result.token);
  };

  const login = async () => {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: "shubham.123@gmail.com",
        password: "123456",
      }),
    });
    const result = await res.json();
    const { token } = result;
    localStorage.setItem("myToken", token);
    return result;
  };

  return (
    <div>
      <button onClick={login} className="px-3 py-2 bg-white text-black">
        Login
      </button>

      <button
        onClick={getProfile}
        className="ml-3 px-3 py-2 bg-white text-black"
      >
        Get Profile
      </button>

      <button
        onClick={refreshToken}
        className="ml-3 px-3 py-2 bg-white text-black"
      >
        Refresh Token
      </button>
    </div>
  );
};

export default Hello;
