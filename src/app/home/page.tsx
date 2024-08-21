"use client";
import "../globals.css";
import Image from "next/image";
import { z, ZodError } from "zod";
import { useEffect, useState } from "react";
import ShowItem from "../Components/ShowItem";
import Counting from "../Components/counting";
import UpdateModal from "../Components/UpdateModal";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../modal/page";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

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
  Admin: boolean;
}
interface DecodedToken {
  userName: string;
  isAdmin: boolean;
  exp: number;
  iat: number;
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
  const router = useRouter();

  const token = localStorage.getItem("token");
  let decode: DecodedToken;

  if (token) {
    decode = jwt.verify(token, "secret_key") as DecodedToken;
  } else {
    router.push("/Login");
  }

  const user = localStorage.getItem("users");

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(items));
    localStorage.setItem("count", count.toString());
  }, [items, count]);

  const addUsers = () => {
    if (decode.isAdmin === true) {
      setShowModal(true);
    } else {
      toast("You are not allowed!");
    }
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
      Admin: false,
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

  let filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteItem = (id: number) => {
    if (decode.isAdmin === true) {
      if (id == 0) {
        toast.error("Not Allowed!");
      } else {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
        setCount(count - 1);
      }
    } else {
      toast.error("Not Allowed!");
    }
  };

  const deleteItemsSelected = (ids: number[]) => {
    if (decode.isAdmin) {
      const updatedItems = items.filter((item) => !ids.includes(item.id));
      setItems(updatedItems);
      setCount(updatedItems.length);
      toast.success("Items deleted successfully");
    } else {
      toast.error("Not Allowed!");
    }
  };

  const lent = filteredItems.length;

  const handleclick = () => {
    router.push("http://localhost:3000/");
    localStorage.removeItem("users");
    localStorage.removeItem("token");
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
    if (decode.isAdmin === true) {
      setItemToUpdate(item);
      setInputName(item.name);
      setInputEmail(item.email);
      setInputPhoneNumber(item.phoneNumber);
      setShowUpdateModal(true);
    } else {
      toast.error("Not Allowed!");
    }
  };

  const updateItem = () => {
    if (decode.isAdmin === true) {
      if (itemToUpdate) {
        const updatedItem: Item = {
          ...itemToUpdate,
          name: inputName,
          email: inputEmail,
          phoneNumber: inputPhoneNumber,
        };

        const result = schema.safeParse(updatedItem);
        if (!result.success) {
          const errorMap: Record<string, string> = {};
          result.error.errors.forEach((error) => {
            errorMap[error.path[0]] = error.message;
          });
          setErrors(errorMap);

          return;
        }
        const updatedItems = items.map((item) =>
          item.id === itemToUpdate.id ? updatedItem : item
        );
        setItems(updatedItems);
        setInputName("");
        setInputEmail("");
        setInputPhoneNumber("");
        setCount(count);
        setShowUpdateModal(false);
        toast.success("Items Updated Successfully");
      }
    } else {
      toast("You are not allowed!");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-200">
      <div className="lg:w-1/4 bg-blue-50 flex flex-col justify-between p-4 lg:p-8">
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 mb-4">
            <Image
              src="/image.png"
              alt="Profile"
              width={90}
              height={90}
              className="rounded-full border-2 border-blue-300"
            />
          </div>
          <p className="text-xl font-semibold mb-4">Hi {user}</p>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={handleclick}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-8 bg-white shadow-lg rounded-lg">
        <Counting
          value={searchTerm}
          onChange={onSearchTermChange}
          count={lent}
        />
        <button
          className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 mb-4"
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
            {[
              { label: "Name", type: "text", value: inputName, onChange: onInputNameChange, error: errors.name },
              { label: "Email", type: "email", value: inputEmail, onChange: onInputEmailChange, error: errors.email },
              { label: "UserName", type: "text", value: inputUserName, onChange: onInputUserNameChange, error: errors.userName },
              { label: "Password", type: "password", value: inputPassword, onChange: onInputPasswordChange, error: errors.password },
              { label: "Phone Number", type: "text", value: inputPhoneNumber, onChange: onInputPhoneNumberChange, error: errors.phoneNumber },
            ].map(({ label, type, value, onChange, error }, index) => (
              <div key={index}>
                <label className="block text-gray-700 font-medium mb-1">
                  {label}:
                </label>
                <input
                  type={type}
                  className={`w-full p-4 border ${error ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150`}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={value}
                  onChange={onChange}
                />
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
              </div>
            ))}

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
            {[
              { label: "Name", type: "text", value: inputName, onChange: onInputNameChange, error: errors.name },
              { label: "Email", type: "email", value: inputEmail, onChange: onInputEmailChange, error: errors.email },
              { label: "Phone Number", type: "tel", value: inputPhoneNumber, onChange: onInputPhoneNumberChange, error: errors.phoneNumber },
            ].map(({ label, type, value, onChange, error }, index) => (
              <div key={index}>
                <label className="block text-gray-700 font-medium mb-1">
                  {label}:
                </label>
                <input
                  type={type}
                  className={`w-full p-4 border ${error ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150`}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={value}
                  onChange={onChange}
                />
                {error && (
                  <span className="text-red-700 text-sm">{error}</span>
                )}
              </div>
            ))}

            <button
              className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 mt-4"
              onClick={updateItem}
            >
              Update
            </button>
          </div>
        </UpdateModal>

        <ShowItem
          filteredItems={filteredItems}
          deleteItem={deleteItem}
          openEditModal={openEditModal}
          Toaster={Toaster}
          deleteItemsSelected={deleteItemsSelected}
        />
      </div>
    </div>
  );
}
