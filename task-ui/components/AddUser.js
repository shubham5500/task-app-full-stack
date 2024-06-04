import React, { useState } from "react";
import Input from "./UI/Input";
import Modal from "./UI/Modal";

const AddUser = ({ isOpen, onClose, users = [], addUserToTask }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <Modal>
      <div className="flex flex-col">
        <h2 className="text-xl mb-4">Add User to Task Board</h2>
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <Input
          type="text"
          className="block w-full p-2 mb-4 border rounded"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="space-y-2">
          {filteredUsers.map((user) => (
            <li
              key={user.email}
              className="flex justify-between items-center p-2 border rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => addUserToTask(user)}
            >
              <span>
                {user.name} ({user.email})
              </span>
              <button className="text-blue-500">Add</button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default AddUser;
