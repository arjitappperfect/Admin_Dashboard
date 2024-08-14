import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Item {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

interface ShowItemProps {
  filteredItems: Item[];
  deleteItem: (id: number) => void;
  openEditModal: (item: Item) => void;
  Toaster: any;
}

const ShowItem: React.FC<ShowItemProps> = ({
  filteredItems,
  deleteItem,
  openEditModal,
  Toaster,
}) => {
  return (
    <>
      <div className="mt-6 space-y-4">
        {filteredItems.map((item) => (
          <div
            className="p-4 bg-white shadow rounded-lg border border-gray-200 flex flex-col"
            key={item.id}
          >
            <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
            <p className="text-gray-600">Email: {item.email}</p>
            <p className="text-gray-600">Phone Number: {item.phoneNumber}</p>
            <button
              className="mt-4 bg-red-500 text-white py-1 px-4 rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => openEditModal(item)}
            >
              Update
            </button>

            <button
              className="mt-4 bg-red-500 text-white py-1 px-4 rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
            <Toaster />
            
          </div>
        ))}
      </div>
    </>
  );
};

export default ShowItem;
