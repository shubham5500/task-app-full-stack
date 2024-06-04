import React from "react";

export default function Modal({children}) {
  return (
    <div className="relative flex justify-center w-full">
      <div className="absolute z-0 min-h-screen h-full w-screen bg-blue-900 opacity-30"></div>
      <div className="flex bg-gray-800 text-white p-4 rounded-md z-10 w-1/2 my-5">
        {children}
      </div>
    </div>
  );
}
