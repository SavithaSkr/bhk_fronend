import React from "react";

export default function EntryPopupModal({
  imageSrc = "/assets/popup.jpeg",
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-black rounded-full w-8 h-8 shadow hover:bg-gray-100 focus:outline-none"
        >
          ✕
        </button>
        <img
          src={imageSrc}
          alt="Welcome"
          className="object-contain max-w-[90vw] max-h-[90vh] rounded-xl border-[8px] border-[#bd9307] shadow-[0_0_25px_rgba(212,175,55,0.6)] bg-white"
        />
      </div>
    </div>
  );
}
