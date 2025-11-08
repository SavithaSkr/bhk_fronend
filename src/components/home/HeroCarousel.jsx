import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Circle } from "lucide-react";

export default function HeroCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      zIndex: 1,
      opacity: 1,
    },
    exit: {
      zIndex: 0,
      opacity: 0,
    },
  };

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (images.length === 0) return; // Prevent interval if no images
    const slideInterval = setInterval(nextImage, 5000); // Change image every 5 seconds
    return () => clearInterval(slideInterval);
  }, [nextImage, images.length]);

  if (images.length === 0) {
    return (
      <div className="relative h-full w-full bg-gray-200 rounded-2xl shadow-2xl flex items-center justify-center text-gray-500">
        No hero images to display.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Temple image ${currentIndex + 1}`}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 1.0 },
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        {images.map((_, index) => (
          <button key={index} onClick={() => goToImage(index)}>
            <Circle
              className={`h-2 w-2 transition-all duration-300 ${
                currentIndex === index
                  ? "fill-white stroke-white/50"
                  : "fill-white/50 stroke-transparent"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
