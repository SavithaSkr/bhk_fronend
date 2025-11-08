import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    const checkFooterOverlap = () => {
      const footer =
        document.querySelector("footer") ||
        document.querySelector(".navbar-header");
      if (!footer) return setIsOverFooter(false);

      const rect = footer.getBoundingClientRect();
      // Button geometry approximated from tailwind classes: bottom-8 (~32px), size ~55px
      const buttonHeight = 55;
      const buttonBottomOffset = 32;
      const buttonBottom = window.innerHeight - buttonBottomOffset;
      const buttonTop = buttonBottom - buttonHeight;

      const overlaps = rect.top < buttonBottom && rect.bottom > buttonTop;
      setIsOverFooter(overlaps);
    };

    const onScroll = () => {
      toggleVisibility();
      checkFooterOverlap();
    };

    const onResize = () => {
      checkFooterOverlap();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Initial run
    toggleVisibility();
    checkFooterOverlap();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const defaultSrc = "/assets/backtoTop.png";
  const footerSrc = "/assets/backtotop2.png"; // make sure this file exists under public/assets/
  const imgSrc = isOverFooter ? footerSrc : defaultSrc;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-[55px] text-white p-3 rounded-full group"
          aria-label="Scroll to top"
        >
          <img
            src={imgSrc}
            alt="Back to top"
            onError={(e) => {
              if (e.currentTarget.src.includes("backtoTop2")) {
                e.currentTarget.src = defaultSrc; // fallback if alt asset missing
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-200" /> */}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
