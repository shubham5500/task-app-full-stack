import { BASE_URL, customFetch } from "@/utils/helper";
import { cookies, headers } from "next/headers";
import React from "react";

async function getUsers() {
  return fetch(`${BASE_URL}/users/all`, {
    method: "GET",
    headers: {
      cookie: cookies(),
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res) => res);
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <ul>
        {users && users.map((user) => <li className="flex gap-12 my-2" key={user.id}>
            <div>{user.username}</div>
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>{user.role}</div>
        </li>)}
      </ul>
    </div>
  );
}
