import TaskCard from "@/components/TaskCard";
import Table from "@/components/UI/Table";
import { BASE_URL } from "@/utils/helper";
import { cookies } from "next/headers";
import React from "react";
export const revalidate = 0;
export const getTasks = async () => {
  const r = await fetch(`${BASE_URL}/tasks/assigned-task`, {
    method: "GET",
    headers: {
      cookie: cookies(),
    },
  });
  return await r.json();
};

export default async function TasksPage() {
  const result = await getTasks();
  if (!result.length) {
    return <p>No data found...</p>
  }
  return (
    <div className="w-1/3 p-4">
      {result &&
        result.length &&
        result.map((item) => <div className="mb-2"><TaskCard taskData={item} /></div>)}
    </div>
  );
}
