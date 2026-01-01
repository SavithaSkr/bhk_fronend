import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../../utils/createPageUrl.js";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const allNavigation = [
    { name: "Home", url: createPageUrl("Home") },
    { name: "About Us", url: createPageUrl("About") },
    { name: "Puja Booking", url: createPageUrl("PujaBooking") },
    { name: "Priest Booking", url: createPageUrl("PriestBooking") },
    { name: "Donations", target: "_blank", url: "https://hanumantempleindiana.square.site/" },
    { name: "Events & Galleries", url: createPageUrl("EventsGalleries") },
    { name: "Volunteer", url: createPageUrl("Volunteer") },
    { name: "Contact Us", url: createPageUrl("Contact") },
  ];

  const isActivePage = (url) => location.pathname === url;
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-orange-50/90 backdrop-blur-sm navbar-header-two thornam-bg">
      {/* Header Section */}
      <div className="thornam-bg relative z-[50]">
        <div className="relative z-20 px-4 pt-3 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-3 my-4 sm:my-0"
            >
              <img src="/assets/Logo.png" alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20" />
              <div>
                <h1 className="text-lg font-bold text-gray-800 sm:text-xl md:text-3xl">
                  Sri Bhaktha Hanuman Temple
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">Indiana</p>
              </div>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white bg-amber-800 rounded-md md:hidden hover:bg-amber-700 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="bg-amber-800 shadow-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 py-3 flex-wrap">
            {allNavigation.map((item) => (
              item.target === "_blank" ? (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-sm font-medium text-white hover:bg-amber-700 rounded-md transition-colors whitespace-nowrap"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    isActivePage(item.url)
                      ? "bg-amber-600 text-white"
                      : "text-white hover:bg-amber-700"
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="bg-amber-800 shadow-md md:hidden">
          <div className="flex flex-col px-4 py-4 space-y-2">
            {allNavigation.map((item) => (
              item.target === "_blank" ? (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="block px-4 py-3 text-base text-center rounded-md text-white hover:bg-amber-700 transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.url}
                  onClick={closeMenu}
                  className={`block px-4 py-3 text-base text-center rounded-md transition-colors ${
                    isActivePage(item.url)
                      ? "bg-amber-600 text-white"
                      : "text-white hover:bg-amber-700"
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
