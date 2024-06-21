
import { customFetch } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LocalStorageService } from "../../../services/localStorage.service";
import { toast } from "react-toastify";

export const LoginForm = () => {
  const [email, setEmail] = useState("shubham@gmail.com");
  const [password, setPassword] = useState("123456");
  const router = useRouter();
  async function login(e) {
    try {
      const result = await customFetch("/auth/login", "POST", {
        email,
        password,
      });
      if (result && (result.status === 'error')) {
        toast(result?.message);
        return;
      }
      
      router.push("/board");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-gray-900">
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full text-gray-900 p-3 rounded  border focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-3 rounded border text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
        />
      </div>
      <button
        type="button"
        onClick={login}
        className="w-full py-3 mt-4 bg-blue-500 text-white rounded-lg shadow-lg"
      >
        Login
      </button>
    </div>
  );
};

/*

import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");
    console.log({token});
  // If no token, redirect to the login page
  if (!token) {
    // redirect('/auth')
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/board"],
};


export const LoginForm = () => {
  const [loginData, setLoginData] = useState(null);
  const router = useRouter();
  async function login() {
    try {
      const res = await customFetch("/auth/login", "POST", {
        email: "shubham.123@gmail.com",
        password: "123456",
      });

      setLoginData(res);
      router.push('/board')
    } catch (error) {}
  }
  return (
    <form className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Email
        </label>
        <input
          type="email"
          className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Password
        </label>
        <input
          type="password"
          className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
        />
      </div>
      <button
        type="button"
        className="w-full py-3 mt-4 bg-blue-500 text-white rounded-lg shadow-lg"
        onClick={login}
      >
        Login
      </button>
    </form>
  );
};


*/
