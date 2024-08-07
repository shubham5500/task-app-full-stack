import React from "react";
import { IoIosAddCircle } from "react-icons/io";
import Link from "next/link";
import { cookies } from "next/headers";
import { MdSpaceDashboard } from "react-icons/md";
import AddBoard from "./(components)/AddBoard";
import { server_url } from "@/utils/helper";
export async function getBoards() {
  return fetch(`${server_url}/board`, {
    method: "GET",
    headers: {
      cookie: cookies(), // this cookies function sends the cookies from the 
                        // incoming req (client's browser) to the next server.
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res) => res);
}

export default async function BoardPage() {
const { boards = [] } = await getBoards();
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
                href={`/board/${item.board_id}`}
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
