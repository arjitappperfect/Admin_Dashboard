"use client";
import { z, ZodError } from "zod";
import { useEffect, useState } from "react";
import SideBar from "./Components/SideBar";
import ShowItem from "./Components/ShowItem";
import Counting from "./Components/counting";
import Modals from "./Components/Modals";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d{10}$/, "Phone number must contain 10 digits"),
});
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const addUsers = () => {
    setShowModal(true);
  };

  const addItem = () => {
    const newItem: Item = {
      id: items.length,
      name: inputName,
      email: inputEmail,
      phoneNumber: inputPhoneNumber,
    };
    try {
      schema.parse(newItem);
      setErrors({});
      setItems([newItem,...items]);
      setInputName("");
      setInputEmail("");
      setInputPhoneNumber("");
      setCount(count + 1);
      setShowModal(false);
    } 
    catch (error) {
      if (error instanceof ZodError) {
        setErrors(
          error.errors.reduce((acc, err) => {
            return { ...acc, [err.path[0]]: err.message };
          }, {})
        );
      }
    }
  };

  console.log(errors);

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
    <div className="flex h-screen bg-gray-200">
      <SideBar />
      <div className="flex-1 p-8 bg-white shadow-lg rounded-lg">
        <Counting
          value={searchTerm}
          onChange={onSearchTermChange}
          count={count}
        />
        <button
          className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          onClick={addUsers}
        >
          Add Users
        </button>
        <Modals isVisible={showModal} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Name:
              </label>
              <input
                type="text"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                placeholder="Enter name"
                value={inputName}
                onChange={onInputNameChange}
              />
              {errors.name && <span className="text-red-700 text-sm">{errors.name}</span>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email:
              </label>
              <input
                type="email"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                placeholder="Enter email"
                value={inputEmail}
                onChange={onInputEmailChange}
              /> {errors.email && <span className="text-red-700 text-sm">{errors.email}</span>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number:
              </label>
              <input
                type="tel"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                placeholder="Enter phone number"
                value={inputPhoneNumber}
                onChange={onInputPhoneNumberChange}
              /> {errors.phoneNumber && <span className="text-red-700 text-sm">{errors.phoneNumber}</span>}
              <button
                className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 mt-4"
                onClick={addItem}
              >
                Add
              </button>
            </div>
          </div>
        </Modals>

        <ShowItem filteredItems={filteredItems} deleteItem={deleteItem} />
      </div>
    </div>
  );
}
