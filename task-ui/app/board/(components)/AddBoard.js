"use client";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { customFetch } from "@/utils/helper";
import React, { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";

export default function AddBoard() {
  const [title, setTitle] = useState("");
  const [addState, setAddState] = useState("ADD_BUTTON");
  const addBoard = async () => {
    await customFetch("/board/create", "POST", {
      title,
    });
    window.location.reload();
  };
  return (
    <div className="w-1/3 min-h-[250px] px-2">
      <div className="h-full flex flex-col text-gray-900 items-center justify-center max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
        {addState === "ADD_BUTTON" && (
          <>
            {" "}
            <p>Add Board</p>
            <IoIosAddCircle
              className="text-[48px]"
              onClick={() => setAddState("CREATE")}
            />
          </>
        )}
        {addState === "CREATE" && (
          <div>
            <h3>Add board</h3>
            <Input
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <Button
              placeholder="Enter board title..."
              onClickHandler={() => {
                addBoard();
                setAddState("ADD_BUTTON");
              }}
              className="text-gray-100 bg-blue-500 px-3 rounded py-2 mt-2 ml-auto"
            >
              Create
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
