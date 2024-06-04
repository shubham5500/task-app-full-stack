"use client";

import { LocalStorageService } from "@/services/localStorage.service";
import { customFetch } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AddUser from "./AddUser";
import Button from "./UI/Button";

const Navbar = ({ user }) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const onLogout = async () => {
    await customFetch("/auth/logout");
    router.push("/auth");
  };

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold"></div>
          <div className="relative flex">
            <Button
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-white hidden sm:block">Shubham</span>
            </Button>
            {dropdownOpen && (
              <div className="absolute right-0 top-8 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <button
                  onClick={onLogout}
                  className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <AddUser isOpen={false} />
    </>
  );
};

export default Navbar;
