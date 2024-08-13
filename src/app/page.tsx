"use client";

import { useEffect, useState } from "react";
import SideBar from "./Components/SideBar";
import ShowItem from "./Components/ShowItem";
import Counting from "./Components/counting";

interface Item {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

const getLocalItems = (): Item[] => {
  const list = localStorage.getItem("lists");
  return list ? JSON.parse(list) : [];
};

const getInitialCount = (): number => {
  const count = localStorage.getItem("count");
  return count ? parseInt(count, 10) : 0;
};

export default function Home() {
  
  const [count, setCount] = useState<number>(getInitialCount());
  const [inputName, setInputName] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPhoneNumber, setInputPhoneNumber] = useState<string>("");
  const [items, setItems] = useState<Item[]>(getLocalItems());
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(items));
    localStorage.setItem("count", count.toString());
  }, [items, count]);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(filteredItems);

  const addItem = () => {
    if (!inputName || !inputEmail || !inputPhoneNumber) return;
    const newItem: Item = {
      id: items.length,
      name: inputName,
      email: inputEmail,
      phoneNumber: inputPhoneNumber,
    };
    setItems([...items, newItem]);
    setInputName("");
    setInputEmail("");
    setInputPhoneNumber("");
    setCount(count + 1);
  };

  const deleteItem = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    setCount(count - 1);
  };

  const onInputNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
  };

  const onInputEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(event.target.value);
  };

  const onInputPhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputPhoneNumber(event.target.value);
  };

  const onSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 p-6 bg-white shadow-md">
        <Counting
          value={searchTerm}
          onChange={onSearchTermChange}
          count={count}
        />
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Name:
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              value={inputName}
              onChange={onInputNameChange}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              value={inputEmail}
              onChange={onInputEmailChange}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Phone Number:
            </label>
            <input
              type="tel"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
              value={inputPhoneNumber}
              onChange={onInputPhoneNumberChange}
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={addItem}
          >
            Add
          </button>
        </div>

        <ShowItem filteredItems={filteredItems} deleteItem={deleteItem} />
      </div>
    </div>
  );
}
