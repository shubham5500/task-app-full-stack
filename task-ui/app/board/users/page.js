import Table from "@/components/UI/Table";
import { server_url } from "@/utils/helper";
import { cookies, headers } from "next/headers";
import React from "react";

async function getUsers() {
  return fetch(`${server_url}/users`, {
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

  return <Table data={users} columns={["id", "username", "name", "email", "role"]} />;
}
