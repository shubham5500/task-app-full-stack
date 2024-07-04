"use client";

import { LocalStorageService } from "@/services/localStorage.service";
import { customFetch } from "@/utils/helper";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddUser from "./AddUser";
import Button from "./UI/Button";
import useUsers from "@/hooks/useUsers";
import useUserDetail from "@/hooks/useUserDetail";

const Navbar = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { users } = useUsers("all");
  const { user: currentUser, getUserDetail } = useUserDetail();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const [assignUserId, setAssignUserId] = useState(null);
  const onLogout = async () => {
    await customFetch("/auth/logout");
    router.push("/auth");
  };

  useEffect(() => {
    const id = LocalStorageService.getItem("user")?.id || "";
    if (id) {
      getUserDetail(id);
    }
  }, []);

  const addMemberToBoard = async () => {
    //
    const { boardId } = params;

    const res = await customFetch("/board/add-user", "POST", {
      userId: assignUserId,
      boardId: boardId,
    });
  };

  const selectCondition = /^\/board\/\d+$/;

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold"></div>
          <div className="relative flex">
            <div className="flex flex-col mx-4">
              <div className="flex">
                {selectCondition.test(pathname) && (
                  <>
                    <label className="text-xs text-gray-400 mb-1">
                      Add user to board
                    </label>
                    <select
                      className="bg-gray-700 p-2 w-full rounded-md"
                      onChange={(e) => {
                        setAssignUserId(e.target.value);
                      }}
                    >
                      {users.length > 0 &&
                        users.map(
                          (item) =>
                            item.id !== currentUser.id && (
                              <option key={item?.id} value={item.id}>
                                {item.name}
                              </option>
                            )
                        )}
                    </select>
                    <Button
                      className="px-4 bg-blue-600 rounded mx-3"
                      onClick={addMemberToBoard}
                    >
                      <span className="text-white hidden sm:block">Add</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Button onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span className="text-white hidden sm:block">Shubham</span>
            </Button>
            {dropdownOpen && (
              <div className="absolute right-0 top-8 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <button
                  onClick={onLogout}
                  className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100 pointer"
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
