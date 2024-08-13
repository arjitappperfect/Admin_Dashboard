// UpdateModal.tsx
import React from "react";

interface UpdateModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className=" p-6 rounded-lg shadow-lg max-w-lg w-[500px] bg-sky-400 ">
        <div>{children}</div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
