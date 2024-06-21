'use client'
import { FaCommentAlt } from "react-icons/fa";
import React from "react";
import { useRouter } from "next/navigation";

const TaskCard = ({ taskData }) => {
  const router = useRouter();
  const onOpen = (id) => {
    router.push(`/tasks/${taskData.board_id}/${id}`);
  };
  return (
    <div
      className="bg-gray-700 p-2 rounded-lg flex flex-col "
      onClick={() => onOpen(taskData.id)}
    >
      <p className="text-white text-md">{taskData.title}</p>
      <p className="text-slate-400 text-sm">{taskData.description}</p>
      <div className="flex gap-1 items-center text-sm">
        <FaCommentAlt /> {taskData.comments}
      </div>
    </div>
  );
};

export default TaskCard;
