interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Confirm</h2>
          <p>Are you sure you want to delete {itemName}?</p>
          <div className="mt-4 flex space-x-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600"
              onClick={onConfirm}
            >
              Delete
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
