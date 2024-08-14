"use client";
import "../globals.css";
import Image from "next/image";
import { z, ZodError } from "zod";
import { useEffect, useState } from "react";
import ShowItem from "/Users/AppPerfect/Desktop/New folder/myapp/src/app/Components/ShowItem";
import Counting from "/Users/AppPerfect/Desktop/New folder/myapp/src/app/Components/counting";
import UpdateModal from "/Users/AppPerfect/Desktop/New folder/myapp/src/app/Components/UpdateModal";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Modal from "../modal/page";

const schema = z.object({
  phoneNumber: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d{10}$/, "Phone number must contain 10 digits"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  userName: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be at most 100 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
});

interface Item {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  userName: string;
  password: string;
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [itemToUpdate, setItemToUpdate] = useState<Item | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [inputUserName, setInputUserName] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(items));
    localStorage.setItem("count", count.toString());
  }, [items, count]);

  const addUsers = () => {
    setShowModal(true);
  };

  const addItem = () => {
    const result = schema.safeParse({
      name: inputName,
      email: inputEmail,
      userName: inputUserName,
      password: inputPassword,
      phoneNumber: inputPhoneNumber,
    });

    if (!result.success) {
      const errorMap: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        errorMap[error.path[0]] = error.message;
      });
      setErrors(errorMap);
      
      return;
    }

    const newItem: Item = {
      id: items.length,
      name: inputName,
      email: inputEmail,
      userName: inputUserName,
      password: inputPassword,
      phoneNumber: inputPhoneNumber,
    };

    setItems([newItem, ...items]);
    setCount(count + 1);
    setInputName("");
    setInputEmail("");
    setInputUserName("");
    setInputPassword("");
    setInputPhoneNumber("");
    setErrors({});
    setShowModal(false);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteItem = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    setCount(count - 1);
    toast("Deleted Successfully!");
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
  const onInputUserNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputUserName(event.target.value);
  };

  const onInputPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputPassword(event.target.value);
  };

  const openEditModal = (item: Item) => {
    setItemToUpdate(item);
    setInputName(item.name);
    setInputEmail(item.email);
    setInputPhoneNumber(item.phoneNumber);
    setShowUpdateModal(true);
  };

  const updateItem = () => {
    if (itemToUpdate) {
      const updatedItem: Item = {
        ...itemToUpdate,
        name: inputName,
        email: inputEmail,
        phoneNumber: inputPhoneNumber,
      };
      try {
        schema.parse(updatedItem);
        setErrors({});
        const updatedItems = items.map((item) =>
          item.id === itemToUpdate.id ? updatedItem : item
        );
        setItems(updatedItems);
        setInputName("");
        setInputEmail("");
        setInputPhoneNumber("");
        setCount(count); // Count remains unchanged
        setShowUpdateModal(false);
      } catch (error) {
        if (error instanceof ZodError) {
          setErrors(
            error.errors.reduce((acc, err) => {
              return { ...acc, [err.path[0]]: err.message };
            }, {})
          );
        }
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <div className="h-screen px-4 pt-8 pb-4 bg-blue-50 flex flex-col justify-between w-80">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-4">
            <Image
              src="/image.png"
              alt=""
              width={90}
              height={90}
              className="rounded-full border-2 border-blue-300"
            />
          </div>
          <p className="text-xl font-semibold mb-4">Hi UserName</p>
          <Link href="http://localhost:3000/">
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
              Logout
            </button>
          </Link>
        </div>
      </div>

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

        <Modal
          isVisible={showModal}
          onClose={() => {
            setInputName("");
            setInputEmail("");
            setInputUserName("");
            setInputPassword("");
            setInputPhoneNumber("");
            setErrors({});
            setShowModal(false);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Name:
              </label>
              <input
                type="text"
                className={`w-full p-4 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150`}
                placeholder="Enter name"
                value={inputName}
                onChange={onInputNameChange}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email:
              </label>
              <input
                type="email"
                className={`w-full p-4 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150`}
                placeholder="Enter email"
                value={inputEmail}
                onChange={onInputEmailChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                UserName:
              </label>
              <input
                type="text"
                className={`w-full p-4 border ${
                  errors.userName ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150`}
                placeholder="Enter username"
                value={inputUserName}
                onChange={onInputUserNameChange}
              />
              {errors.userName && (
                <p className="text-red-500 text-sm">{errors.userName}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password:
              </label>
              <input
                type="password"
                className={`w-full p-4 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150`}
                placeholder="Enter password"
                value={inputPassword}
                onChange={onInputPasswordChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number:
              </label>
              <input
                type="text"
                className={`w-full p-4 border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150`}
                placeholder="Enter password"
                value={inputPhoneNumber}
                onChange={onInputPhoneNumberChange}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>

            <button
              className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 mt-4"
              onClick={addItem}
            >
              Add
            </button>
          </div>
        </Modal>
        <UpdateModal
          isVisible={showUpdateModal}
          onClose={() => {
            setInputName("");
            setInputEmail("");
            setInputPhoneNumber("");
            setShowUpdateModal(false);
          }}
          onSubmit={updateItem}
        >
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
              {errors.name && (
                <span className="text-red-700 text-sm">{errors.name}</span>
              )}
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
              />
              {errors.email && (
                <span className="text-red-700 text-sm">{errors.email}</span>
              )}
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
              />
              {errors.phoneNumber && (
                <span className="text-red-700 text-sm">
                  {errors.phoneNumber}
                </span>
              )}
              <button
                className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 mt-4"
                onClick={updateItem}
              >
                Update
              </button>
            </div>
          </div>
        </UpdateModal>

        <ShowItem
          filteredItems={filteredItems}
          deleteItem={deleteItem}
          openEditModal={openEditModal}
          Toaster={Toaster}
        />
      </div>
    </div>
  );
}
