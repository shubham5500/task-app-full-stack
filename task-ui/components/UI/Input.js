import React from "react";

export default function Input({...props}) {
  return (
    <input
      type="text"
      className="bg-gray-700 p-2 w-full rounded-md"
      {...props}
    />
  );
}
