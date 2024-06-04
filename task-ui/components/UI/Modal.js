import React from "react";

export default function Modal({children}) {
  return (
    <div className="relative flex justify-center w-full h-full min-h-screen">
      <div className="absolute z-0 bg-blue-900 opacity-30 w-full h-full"></div>
      <div className="flex bg-gray-800 text-white p-4 rounded-md z-10 w-1/2 my-5 h-fit">
        {children}
      </div>
    </div>
  );
}
