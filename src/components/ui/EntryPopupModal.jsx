import React, { useState } from "react";

export default function EntryPopupModal({
  images = [],
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Don't show popup if no images from Google Drive
  if (!images || images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-black rounded-full w-8 h-8 shadow hover:bg-gray-100 focus:outline-none z-10"
        >
          ✕
        </button>
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-black rounded-full w-10 h-10 shadow hover:bg-white focus:outline-none z-10"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-black rounded-full w-10 h-10 shadow hover:bg-white focus:outline-none z-10"
            >
              ›
            </button>
          </>
        )}
        
        <img
          src={images[currentIndex]?.image_url}
          alt={images[currentIndex]?.title || "Event Poster"}
          className="object-contain max-w-[90vw] max-h-[90vh] rounded-xl border-[8px] border-[#bd9307] shadow-[0_0_25px_rgba(212,175,55,0.6)] bg-white"
        />
        
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
