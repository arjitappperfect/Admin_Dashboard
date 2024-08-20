"use client"
import React, { ReactNode } from "react";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[500px] bg-sky-400 rounded-md">
        <button
          className="bg-red-600 text-white text-xl rounded-md  p-1"
          onClick={onClose}
        >
          X
        </button>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
