"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import jwt from 'jsonwebtoken'

interface Item {
  id: number;
  name: string;
  email: string;
  userName: string;
  password: string;
  phoneNumber: string;
  Admin: boolean;
}

const getLocalUser = ()=>{
  const users= localStorage.getItem("user");
  return users ? JSON.parse(users) : null
}

const getLocalItems = (): Item[] => {
  const list = localStorage.getItem("lists");
  return list ? JSON.parse(list) : [];
};

export default function Login() {
  
  const router = useRouter();
  const [inputUserName, setInputUserName] = useState<string>("");
  const [items, setItems] = useState<Item[]>(getLocalItems());
  const [inputPassword, setInputPassword] = useState<string>("");
  const [currentUser, setCurrentUser] =useState(getLocalUser());
  
  useEffect(() => {
    if(currentUser){
    localStorage.setItem("users", JSON.stringify(currentUser));
    }
  }, [currentUser]);
  const users = localStorage.getItem('users');

  useEffect(() => {
    if (users) {
      router.push('/home');
    }
  }, [users, router]);

  
  const LoginclickHandle = () => {
    const user = items.find(
      (item) =>
        item.userName === inputUserName && item.password === inputPassword
    );

    if (user) { 
      const token = jwt.sign({ userName: user.userName ,password:user.password,isAdmin:user.Admin}, "secret_key");

      localStorage.setItem("token", token);
      setCurrentUser(user.userName)
      router.push("/home");
    }  else {
      alert("Wrong username or password");
    }
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

  const handleclick=()=>{
    router.push("/SignUp")
  }
  return (
    <div className='bg-slate-600 flex items-center justify-center min-h-screen p-4'>
      <div className="max-w-md w-full bg-pink-200 shadow-lg rounded-lg p-8">
        <h2 className="text-2xl text-gray-800 mb-6 text-center">Login</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              UserName:
            </label>
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              placeholder="Enter username"
              value={inputUserName}
              onChange={onInputUserNameChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password:
            </label>
            <input
              type="password"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              placeholder="Enter password"
              value={inputPassword}
              onChange={onInputPasswordChange}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 mt-4 "
              onClick={LoginclickHandle}
            >
              LOGIN
            </button>
            
            {/* <SignUp isHome={false} /> */}
          </div>
          <div className="flex justify-center">
          <h3 >
              Didn't have an account. Click here for <button className="underline text-red-500" 
              onClick={handleclick}
              >SignUp</button>
            </h3>
            </div>
        </div>
      </div>
    </div>
  );
}
