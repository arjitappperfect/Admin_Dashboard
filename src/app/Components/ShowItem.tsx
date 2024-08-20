"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../Components/ConfirmModal";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import jwt from "jsonwebtoken";
interface Item {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  userName: string;
  password: string;
  Admin: boolean;
}
interface ShowItemProps {
  filteredItems: Item[];
  deleteItem: (id: number) => void;
  openEditModal: (item: Item) => void;
  Toaster: any;
}
interface DecodedToken {
  userName: string;
  isAdmin: boolean;
  exp: number;
  iat: number;
}

const ShowItem: React.FC<ShowItemProps> = ({
  filteredItems,
  deleteItem,
  openEditModal,
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [sortColumn, setSortColumn] = useState<"name" | "email" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const token: string = localStorage.getItem("token");
  let decode: DecodedToken;
  decode = jwt.verify(token, "secret_key") as unknown as DecodedToken;

  const handleDeleteClick = (item: Item) => {
    if (decode.isAdmin === true) {
      setItemToDelete(item);
      setModalOpen(true);
    } else {
      toast.error("Not Allowed!");
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete.id == 0) {
      toast.error("Not Allowed! You can't delete admin");
    } else {
      if (itemToDelete) {
        deleteItem(itemToDelete.id);
        toast.success("Item deleted successfully");
        setItemToDelete(null);
      }
      setModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setItemToDelete(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const sortItems = (
    items: Item[],
    column: "name" | "email",
    direction: "asc" | "desc"
  ) => {
    return [...items].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (direction === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };

  const sortedItems = sortColumn
    ? sortItems(filteredItems, sortColumn, sortDirection)
    : filteredItems;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedItems.slice(startIndex, endIndex);

  const isAllSelected = () => {
    return (
      currentItems.length > 0 &&
      currentItems.every((item) => selectedItems.includes(item.id))
    );
  };

  const handleCheckboxChange = (itemId: number, checked: boolean) => {
    setSelectedItems((prevSelectedItems) =>
      checked
        ? [...prevSelectedItems, itemId]
        : prevSelectedItems.filter((id) => id !== itemId)
    );
  };
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = currentItems.map((item) => item.id);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="text-gray-600">Selected Rows: {selectedItems.length}</div>
      <div className="flex justify-end">
        {/* <button className="bg-red-500 text-white py-1 px-4 rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
          Delete Selected
        </button> */}
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="py-3 px-4 text-left text-gray-600">
              <input
                type="checkbox"
                checked={isAllSelected()}
                onChange={handleSelectAll}
                className="form-checkbox"
              />
            </th>
            <th className="py-3 px-12 text-left text-gray-600">
              Name
              <button
                className="ml-2 p-1 rounded-lg hover:bg-gray-200"
                onClick={() => {
                  const newDirection =
                    sortColumn === "name" && sortDirection === "asc"
                      ? "desc"
                      : "asc";
                  setSortColumn("name");
                  setSortDirection(newDirection);
                }}
              >
                {sortColumn === "name" ? (
                  sortDirection === "asc" ? (
                    <AiOutlineSortAscending />
                  ) : (
                    <AiOutlineSortDescending />
                  )
                ) : (
                  <AiOutlineSortAscending />
                )}
              </button>
            </th>
            <th className="py-3 px-6 text-left text-gray-600">
              Email
              <button
                className="ml-2 p-1 rounded-lg hover:bg-gray-200"
                onClick={() => {
                  const newDirection =
                    sortColumn === "email" && sortDirection === "asc"
                      ? "desc"
                      : "asc";
                  setSortColumn("email");
                  setSortDirection(newDirection);
                }}
              >
                {sortColumn === "email" ? (
                  sortDirection === "asc" ? (
                    <AiOutlineSortAscending />
                  ) : (
                    <AiOutlineSortDescending />
                  )
                ) : (
                  <AiOutlineSortAscending />
                )}
              </button>
            </th>
            <th className="py-3 px-6 text-left text-gray-600">Phone Number</th>
            <th className="py-3 px-6 text-left text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr className="border-b">
              <td className="py-4 px-6 text-gray-800"></td>
              <td className="py-4 px-6 text-gray-600">No record</td>
              <td className="py-4 px-6 text-gray-600">No record</td>
              <td className="py-4 px-6 text-gray-600">No record</td>
              <td className="py-4 px-6 text-gray-600">No record</td>
            </tr>
          ) : (
            currentItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-4 px-4 text-gray-800">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) =>
                      handleCheckboxChange(item.id, e.target.checked)
                    }
                    className="form-checkbox"
                  />
                </td>
                <td className="py-4 px-6 text-gray-800">{item.name}</td>
                <td className="py-4 px-6 text-gray-600">{item.email}</td>
                <td className="py-4 px-6 text-gray-600">{item.phoneNumber}</td>
                <td className="py-4 px-6 flex space-x-2">
                  <button
                    className="bg-blue-500 text-white py-1 px-4 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => openEditModal(item)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-4 rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => handleDeleteClick(item)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <button
          className="bg-gray-500 text-white py-1 px-4 rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {totalPages === 0 ? (
          <span>Page 0 of {totalPages}</span>
        ) : (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}

        <button
          className="bg-gray-500 text-white py-1 px-4 rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <Toaster />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name || ""}
      />
    </div>
  );
};

export default ShowItem;
