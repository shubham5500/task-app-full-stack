import { FaCommentAlt } from "react-icons/fa";
import React from "react";

const TaskCard = ({ taskData, onTaskDetail }) => {
  return (
    <div
      className="bg-gray-700 p-2 rounded-lg flex flex-col "
      onClick={() => onTaskDetail(taskData.id)}
    >
      <p className="text-white text-md">{taskData.title}</p>
      <p className="text-slate-400 text-sm">{taskData.description}</p>
      <div className="flex gap-1 items-center text-sm">
        <FaCommentAlt/> {taskData.comments}
      </div>
    </div>
  );
};

export default TaskCard;