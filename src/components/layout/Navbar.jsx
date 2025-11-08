import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../../utils/createPageUrl.js";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dropdownNavigation = [
    { name: "Puja Booking", url: createPageUrl("PujaBooking") },
    { name: "Priest Booking", url: createPageUrl("PriestBooking") },
    { name: "Donations", url: createPageUrl("Donations") },
    { name: "Events & Galleries", url: createPageUrl("EventsGalleries") },
  ];

  const isActivePage = (url) => location.pathname === url;
  const closeMenu = () => setIsMobileMenuOpen(false);

  // ✅ Highlight More if any of its child pages is active
  const isActiveMore = dropdownNavigation.some(
    (item) => location.pathname === item.url
  );

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-orange-50/90 backdrop-blur-sm navbar-header-two thornam-bg">
      <div className="thornam-bg relative z-[50]">
        <div className="relative z-20 px-4 pt-3 mx-auto max-w-7xl">
          <div className="flex items-center justify-between ">
            {/* Logo */}
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-3 my-4 sm:my-0"
            >
              <img src="/assets/Logo.png" alt="Logo" className="w-20 h-20" />
              <div>
                <h1 className="text-xl font-bold text-gray-800 md:text-3xl">
                  Sri Bhaktha Hanuman Temple
                </h1>
                <p className="text-sm text-gray-600">Indiana</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="relative z-20 items-center hidden gap-4 py-10 lg:flex">
              {/* Home */}
              <Link
                to={createPageUrl("Home")}
                className="px-3 py-2 text-sm font-medium transition-colors rounded-md"
                style={{
                  color: isActivePage(createPageUrl("Home"))
                    ? "white"
                    : "var(--color-text-medium)",
                  backgroundColor: isActivePage(createPageUrl("Home"))
                    ? "var(--color-primary)"
                    : "transparent",
                }}
              >
                Home
              </Link>

              {/* About */}
              <Link
                to={createPageUrl("About")}
                className="px-3 py-2 text-sm font-medium transition-colors rounded-md"
                style={{
                  color: isActivePage(createPageUrl("About"))
                    ? "white"
                    : "var(--color-text-medium)",
                  backgroundColor: isActivePage(createPageUrl("About"))
                    ? "var(--color-primary)"
                    : "transparent",
                }}
              >
                About Us
              </Link>

              {/* More (Dropdown) */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-md"
                  style={{
                    color: isActiveMore ? "white" : "var(--color-text-medium)",
                    backgroundColor: isActiveMore
                      ? "var(--color-primary)"
                      : "transparent",
                  }}
                >
                  More <ChevronDown size={16} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute w-48 mt-2 bg-white border border-gray-200 rounded-md shadow-lg top-full">
                    <ul className="flex flex-col">
                      {dropdownNavigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.url}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Volunteer */}
              <Link
                to={createPageUrl("Volunteer")}
                className="px-3 py-2 text-sm font-medium transition-colors rounded-md"
                style={{
                  color: isActivePage(createPageUrl("Volunteer"))
                    ? "white"
                    : "var(--color-text-medium)",
                  backgroundColor: isActivePage(createPageUrl("Volunteer"))
                    ? "var(--color-primary)"
                    : "transparent",
                }}
              >
                Volunteer
              </Link>

              {/* Contact */}
              <Link
                to={createPageUrl("Contact")}
                className="px-3 py-2 text-sm font-medium transition-colors rounded-md"
                style={{
                  color: isActivePage(createPageUrl("Contact"))
                    ? "white"
                    : "var(--color-text-medium)",
                  backgroundColor: isActivePage(createPageUrl("Contact"))
                    ? "var(--color-primary)"
                    : "transparent",
                }}
              >
                Contact Us
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 bg-orange-500 rounded-md lg:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="border-t border-gray-200 shadow-lg lg:hidden bg-orange-50/95 backdrop-blur-md">
          <div className="flex flex-col px-4 py-4 space-y-2">
            <Link
              to={createPageUrl("Home")}
              onClick={closeMenu}
              className={`block px-4 py-2 text-base text-center rounded-md ${
                isActivePage(createPageUrl("Home"))
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-orange-100"
              }`}
            >
              Home
            </Link>
            <Link
              to={createPageUrl("About")}
              onClick={closeMenu}
              className={`block px-4 py-2 text-base text-center rounded-md ${
                isActivePage(createPageUrl("About"))
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-orange-100"
              }`}
            >
              About Us
            </Link>

            {/* Mobile Dropdown */}
            <details className="px-2" open={isActiveMore}>
              <summary
                className={`cursor-pointer px-4 py-2 text-base text-center rounded-md ${
                  isActiveMore
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-orange-100"
                }`}
              >
                More
              </summary>
              <div className="flex flex-col mt-2 ml-4 space-y-1">
                {dropdownNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.url}
                    onClick={closeMenu}
                    className={`block px-4 py-2 text-sm text-center rounded-md ${
                      isActivePage(item.url)
                        ? "bg-orange-500 text-white"
                        : "text-gray-700 hover:bg-orange-100"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </details>

            <Link
              to={createPageUrl("Volunteer")}
              onClick={closeMenu}
              className={`block px-4 py-2 text-base text-center rounded-md ${
                isActivePage(createPageUrl("Volunteer"))
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-orange-100"
              }`}
            >
              Volunteer
            </Link>
            <Link
              to={createPageUrl("Contact")}
              onClick={closeMenu}
              className={`block px-4 py-2 text-base text-center rounded-md ${
                isActivePage(createPageUrl("Contact"))
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-orange-100"
              }`}
            >
              Contact Us
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
