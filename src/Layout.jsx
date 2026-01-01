import React, { useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import CompactPanchangamBar from "./components/temple/CompactPanchangamBar.jsx";
import ScrollToTopButton from "./components/ui/ScrollToTopButton.jsx";
import EntryPopupModal from "./components/ui/EntryPopupModal.jsx";
import CursorImageTrail from "./components/effects/CursorImageTrail.jsx";
import { set } from "date-fns";

export default function Layout({ children }) {
  const flowerGifUrl = "/assets/flowers.png"; // Use existing flower image instead of missing GIF
  const [showEntryPopup, setShowEntryPopup] = useState(true);
  const [posterImages, setPosterImages] = useState([]);

  const POSTER_FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID_POSTERS;
  const API_KEY = import.meta.env.VITE_GDRIVE_KEY;

  useEffect(() => {
    const loadPosterImages = async () => {
      try {
        if (!POSTER_FOLDER_ID || !API_KEY) {
          return;
        }

        const postersUrl = `https://www.googleapis.com/drive/v3/files?q='${POSTER_FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,thumbnailLink,webViewLink)&orderBy=createdTime desc`;
        
        const response = await fetch(postersUrl);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.files && data.files.length > 0) {
            const formattedImages = data.files.slice(0, 3).map((file) => ({
              id: file.id,
              title: file.name,
              image_url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`,
              google_drive_link: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
            }));
            setPosterImages(formattedImages);
          }
        }
      } catch (error) {
        console.error("Error loading poster images:", error);
      }
    };

    loadPosterImages();

    // Auto-close popup after 3 seconds
    const timer = setTimeout(() => {
      setShowEntryPopup(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Lock body scroll while popup is open
    if (showEntryPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
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

      {/* Entry Popup Modal */}
      {showEntryPopup && (
        <EntryPopupModal
          images={posterImages}
          onClose={handleClosePopup}
        />
      )}

      {/* Site Content - Always visible */}
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
