import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<Props> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 min-w-[300px] relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;