import { customFetch } from "@/utils/helper";
import React, { useEffect, useState } from "react";

export default function useUsers(boardId) {
  const [users, setUsers] = useState([]);
  const getUserByBoardId = async () => {
    const results = await customFetch(`/board/${boardId}/users`, "GET");

    setUsers(results || []);
  };
  useEffect(() => {
    getUserByBoardId()
  }, [boardId]);

  return { users };
}
