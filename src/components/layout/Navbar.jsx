import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../../utils/createPageUrl.js";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingDropdownOpen, setIsBookingDropdownOpen] = useState(false);

  const bookingOptions = [
    { name: "Puja Booking", url: createPageUrl("PujaBooking") },
    { name: "Priest Booking", url: createPageUrl("PriestBooking") },
    { name: "Special Pooja Booking", url: createPageUrl("SpecialPoojaBooking") },
  ];

  const allNavigation = [
    { name: "Home", url: createPageUrl("Home") },
    { name: "About Us", url: createPageUrl("About") },
    { name: "Booking", isDropdown: true, options: bookingOptions },
    { name: "Donations", target: "_blank", url: "https://hanumantempleindiana.square.site/" },
    { name: "Events & Galleries", url: createPageUrl("EventsGalleries") },
    { name: "Fresh Garland Order", url: createPageUrl("Garland") },
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
              className="flex items-center gap-3 my-4 sm:my-0 py-3"
            >
              <img src="/assets/Logo.png" alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20" />
              <div>
                <h1 className="text-lg font-bold text-gray-800 sm:text-xl md:text-3xl">
                  Sri Bhaktha Hanuman Temple
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">Indiana</p>
              </div>
            </Link>
                <p className="text-md sm:text-md text-gray-600 hidden md:block">A "not for profit" tax exempt organization - Tax ID # 39-2431107</p>
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
      <nav className="bg-[#bb2425] shadow-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 py-3 flex-wrap">
            {allNavigation.map((item) => (
              item.isDropdown ? (
                <div key={item.name} className="relative">
                  <button
                    onClick={() => setIsBookingDropdownOpen(!isBookingDropdownOpen)}
                    className="flex items-center gap-1 px-3 py-2 text-md font-medium text-white hover:bg-amber-700 rounded-md transition-colors whitespace-nowrap"
                  >
                    {item.name}
                    <ChevronDown size={16} className={`transition-transform ${isBookingDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isBookingDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md py-2 min-w-[150px] z-50">
                      {item.options.map((option) => (
                        <Link
                          key={option.name}
                          to={option.url}
                          onClick={() => setIsBookingDropdownOpen(false)}
                          className={`block px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                            isActivePage(option.url) ? "bg-amber-100 text-amber-800" : "text-gray-700"
                          }`}
                        >
                          {option.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : item.target === "_blank" ? (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-md font-medium text-white hover:bg-amber-700 rounded-md transition-colors whitespace-nowrap"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`px-3 py-2 text-md font-medium rounded-md transition-colors whitespace-nowrap ${
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
              item.isDropdown ? (
                <div key={item.name}>
                  <button
                    onClick={() => setIsBookingDropdownOpen(!isBookingDropdownOpen)}
                    className="flex items-center justify-center gap-1 w-full px-4 py-3 text-base rounded-md text-white hover:bg-amber-700 transition-colors"
                  >
                    {item.name}
                    <ChevronDown size={16} className={`transition-transform ${isBookingDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isBookingDropdownOpen && (
                    <div className="mt-2 space-y-1">
                      {item.options.map((option) => (
                        <Link
                          key={option.name}
                          to={option.url}
                          onClick={closeMenu}
                          className={`block px-6 py-2 text-sm text-center rounded-md transition-colors ${
                            isActivePage(option.url)
                              ? "bg-amber-600 text-white"
                              : "text-white hover:bg-amber-700"
                          }`}
                        >
                          {option.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : item.target === "_blank" ? (
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
