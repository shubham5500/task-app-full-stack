import { customFetch } from "@/utils/helper";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

export const RegisterForm = ({setIsLogin}) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ name, username, email, password });
    // Add registration logic here
    try {
      await customFetch("/auth/register", "POST", {
        name,
        email,
        username,
        password,
      });
      setIsLogin('LOGIN');
      toast("Registered Successfully!")
    } catch (error) {
        toast("Wow so easy!")
    }
  };
  return (
    <form className="space-y-4 text-gray-900">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full p-3 rounded border text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full p-3 rounded border text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Username"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full p-3 rounded border text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        onClick={handleSubmit}
        className="w-full py-3 mt-4 bg-blue-500 text-white rounded-lg shadow-lg"
      >
        Register
      </button>
    </form>
  );
};
