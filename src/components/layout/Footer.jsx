import React from "react";
import {
  Phone,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils/createPageUrl.js";

export default function Footer() {
  const navigationItems = [
    { name: "Home", url: createPageUrl("Home") },
    { name: "About Us", url: createPageUrl("About") },
    { name: "Puja Booking", url: createPageUrl("PujaBooking") },
    { name: "Priest Booking", url: createPageUrl("PriestBooking") },
    { name: "Donations", url: createPageUrl("Donations") },
  ];

  return (
    <footer className="bg-gray-800 text-white navbar-header">
      <div className="max-w-7xl mx-auto px-4 py-12 z-30 relative">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Temple Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/Logo.png"
                alt="Sri Bhaktha Hanuman Temple Logo"
                className="w-12 h-12"
              />
              <div>
                <h3 className="font-bold text-lg text-white">
                  Sri Bhaktha Hanuman Temple
                </h3>
                <p className="text-sm text-gray-200">Indiana</p>
              </div>
            </div>
            <p className="text-gray text-sm leading-relaxed">
              A sacred place of worship dedicated to Lord Hanuman, serving the
              Hindu community with devotion and spiritual guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className="block text-gray hover:text-orange-200 text-sm transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Temple Hours */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Temple Hours</h4>
            <div className="space-y-2 text-sm text-gray">
              <div>
                <p className="font-medium">Weekdays</p>
                <p>09:00 AM - 11:30 AM & 06:00 PM - 08:30 PM</p>
              </div>
              <div className="mt-3">
                <p className="font-medium">Weekends</p>
                <p>08:30 AM - 02:30 PM & 05:30 PM - 08:30 PM</p>
              </div>
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-grey-200" />
                <span>248-525-8917</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-grey-200" />
                <span>info@hanumantemple.org</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-grey-200 mt-1" />
                <span>
                  10080 E 121st Street, Suite 130A
                  <br />
                  Fishers, IN 46037
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#E4405F] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#FF0000] transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mt-12 border-gray-700 border-t">
          <div className=" mt-3 pt-6 text-start text-sm text-gray-200">
            <p>
              &copy; {new Date().getFullYear()} Sri Bhaktha Hanuman Temple -
              Indiana. All rights reserved.
            </p>
            <p className="mt-1">Built with devotion for the community</p>
          </div>
          <div className="mt-3 pt-6 text-start text-sm text-gray-200">
            <p>
              &copy; {new Date().getFullYear()} Design and Developed by{" "}
              <a
                href="https://www.thedesigndynasty.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-200 transition-colors"
              >
                Design Dynasty
              </a>{" "}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
