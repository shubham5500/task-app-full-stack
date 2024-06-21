import { customFetch } from "@/utils/helper";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useUserDetail() {
  const [user, setUser] = useState(null);
  const getUserDetail = async (userId) => {
    try {
      const res = await customFetch(`/users/${userId}`);
      setUser({
        ...res,
      });
    } catch (error) {
      toast(error);
    }
  };
  //   useEffect(() => {
  //     getUserDetail();
  //   }, [userId, getUserDetail]);

  return { user, getUserDetail };
}
