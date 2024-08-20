import React from 'react';
interface ModalsProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modals: React.FC<ModalsProps> = ({ isVisible, onClose, children }) => {
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

export default Modals;

