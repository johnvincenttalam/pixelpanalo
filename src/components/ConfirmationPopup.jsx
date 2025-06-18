import { useEffect, useState } from "react";

const ConfirmationPopup = ({ isOpen, onConfirm, onCancel }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      // Delay removal so exit animation can play
      const timer = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-200`}
    >
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${
          isOpen ? "opacity-70" : "opacity-0"
        }`}
        onClick={onCancel}
      />

      <div
        className={`relative z-10 bg-white text-[#1B1926] p-4 rounded-lg shadow-lg max-w-sm mx-4 w-full transition-all duration-200 transform ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
        <p className="mb-6 font-inter">
          Do you really want to go back? Unsaved changes may be lost.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 bg-[#F2BC57] text-[#1B1926] rounded"
          >
            Yes, Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
