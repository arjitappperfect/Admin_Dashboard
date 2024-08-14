"use client";
import React, { useEffect, useState } from "react";
import "../globals.css";
import Modal from "../modal/page";
import { useRouter } from "next/navigation";
import { z, ZodError } from "zod";
import { error } from "console";

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

const getLocalItems = (): Item[] => {
  const list = localStorage.getItem("lists");
  return list ? JSON.parse(list) : [];
};
const getInitialCount = (): number => {
  const count = localStorage.getItem("count");
  return count ? parseInt(count, 10) : 0;
};

interface Item {
  id: number;
  name: string;
  email: string;
  userName: string;
  password: string;
  phoneNumber: string;
}

export default function Home(props: any) {

  const [count, setCount] = useState<number>(getInitialCount());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>(getLocalItems());
  const [inputName, setInputName] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputUserName, setInputUserName] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const [inputPhoneNumber, setInputPhoneNumber] = useState<string>("");
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
     console.log(result.error.errors)
    console.log(errorMap);
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
    
    setCount(count + 1);
    setItems([newItem, ...items]);
    setInputName("");
    setInputEmail("");
    setInputUserName("");
    setInputPassword("");
    setInputPhoneNumber("");
    setErrors({});
    setShowModal(false);
    router.push("/home");
  };
  

  const onInputNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
  };

  const onInputEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(event.target.value);
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
  const onInputPhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputPhoneNumber(event.target.value);
  };
  return (
    <>
      <button
        className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 mt-4"
        onClick={addUsers}
      >
        Sign Up
      </button>
      <Modal
        isVisible={showModal}
        onClose={() => {
          setInputName("");
          setInputEmail("");
          setInputUserName("");
          setInputPassword("");
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
    </>
  );
}
