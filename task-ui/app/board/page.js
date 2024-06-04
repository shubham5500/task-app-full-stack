import React from "react";
import { IoIosAddCircle } from "react-icons/io";
import Link from "next/link";
import { BASE_URL } from "@/utils/helper";
import { cookies } from "next/headers";
import { MdSpaceDashboard } from "react-icons/md";
import AddBoard from "./(components)/AddBoard";

export async function getBoards() {
  return fetch(`${BASE_URL}/board`, {
    method: "GET",
    headers: {
      cookie: cookies(), // this cookies function gives the cookies from the incoming req i.e the client's browser req
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res) => res);
}

export default async function BoardPage() {
  const { boards } = await getBoards();
  return (
    <div className="flex p-4 w-full flex-wrap gap-y-4">
      {boards.map((item) => (
        <div className="w-1/3 px-2 min-h-[250px]">
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="flex items-center justify-center bg-gray-200 h-48">
              <MdSpaceDashboard className="text-gray-500 text-6xl" />
            </div>
            <div className="p-4">
              <Link
                href={`/board/${item.id}`}
                className="text-sm text-blue-500 underline font-semibold"
              >
                {item.title}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <AddBoard />
    </div>
  );
}
