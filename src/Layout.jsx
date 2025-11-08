import React, { useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import CompactPanchangamBar from "./components/temple/CompactPanchangamBar.jsx";
import ScrollToTopButton from "./components/ui/ScrollToTopButton.jsx";
import EntryPopupModal from "./components/ui/EntryPopupModal.jsx";
import CursorImageTrail from "./components/effects/CursorImageTrail.jsx";

export default function Layout({ children }) {
  const flowerGifUrl = "/assets/falling_flowers.gif";

  // Show popup on every refresh and navigation
  const [showEntryPopup, setShowEntryPopup] = useState(true);

  useEffect(() => {
    // Lock body scroll while popup is open
    if (showEntryPopup) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [showEntryPopup]);

  const handleClosePopup = () => {
    setShowEntryPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative isolate">
      {/* Global cursor image (visible on all pages) */}
      <CursorImageTrail
        images={["/assets/cursor.png"]}
        count={1}
        size={40}
        fade={false}
        zIndex={9999}
        excludeSelectors={[
          "header",
          "footer",
          ".navbar-header",
          ".navbar-header-two",
        ]}
      />

      {/* Animated Flower Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${flowerGifUrl})`,
          backgroundRepeat: "repeat",
          zIndex: -1,
          pointerEvents: "none",
          opacity: 0.2,
        }}
      />

      {/* Entry Popup Modal (blocks content until closed) */}
      {showEntryPopup && (
        <EntryPopupModal
          imageSrc="/assets/popup.jpeg"
          onClose={handleClosePopup}
        />
      )}

      {/* Only render site content after popup is closed */}
      {!showEntryPopup && (
        <>
          {/* Compact Panchangam Bar */}
          <CompactPanchangamBar />

          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <Footer />

          {/* Scroll to Top Button */}
          <ScrollToTopButton />
        </>
      )}
    </div>
  );
}
