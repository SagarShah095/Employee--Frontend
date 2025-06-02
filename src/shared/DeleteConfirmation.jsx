import React from "react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to Delete this?",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p>{message}</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded transition bg-gray-300 hover:bg-gray-400`}
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded transition bg-red-500 text-white hover:bg-red-600`}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
