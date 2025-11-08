import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/createPageUrl.js"; // Updated import path
import { GoogleDriveImage, HeroImage, Events } from "../services/entities.js"; // Updated import path for API calls
// Assuming you will copy Button, Card, CardContent, CardHeader, CardTitle to your components/ui folder
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../components/ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Calendar,
  Heart,
  Users,
  Coins,
  MapPin,
  Clock,
  Phone,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import HeroCarousel from "../components/home/HeroCarousel.jsx"; // Updated import path
import CursorImageTrail from "../components/effects/CursorImageTrail.jsx";

// Placeholder Shadcn components for local setup

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Fallback images if no database images are available or API fails
  const fallbackImages = [
    "/assets/hanumanphoto1.jpg",
    "/assets/hanumanphoto2.jpg",
    "/assets/temple1.jpg",
    "/assets/temple2.jpg",
  ];

  useEffect(() => {
    const loadGoogleCalendarEvents = async () => {
      try {
        const response = await Events.fetchGoogleCalendarEvents(); // Updated API call
        if (response.success && response.events) {
          setEvents(response.events.slice(0, 3)); // Show only first 3 events
        } else {
          console.error(
            "Error loading Google Calendar events:",
            response.error
          );
          setEvents([]); // Set empty events array on error
        }
      } catch (error) {
        console.error("Error loading Google Calendar events (catch):", error);
        setEvents([]);
      }
      setEventsLoading(false);
    };

    const loadData = async () => {
      try {
        const [galleryData, heroImagesData] = await Promise.all([
          GoogleDriveImage.list("-created_date", 6), // Fetches from local backend
          HeroImage.filter({ is_active: true }, "display_order"), // Fetches from local backend
        ]);
        setGalleryImages(galleryData);
        setHeroImages(heroImagesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
      setLoading(false);

      loadGoogleCalendarEvents(); // Load Google Calendar events separately
    };

    loadData();
  }, []); // Empty dependency array means this effect runs once after initial render

  // Use database images if available, otherwise use fallback images
  const carouselImages =
    heroImages.length > 0
      ? heroImages.map((img) => img.image_url)
      : fallbackImages;

  // Images available in /public/assets to alternate in the trail
  const cursorImages = ["/assets/cursor.png", "/assets/cursor.png"];

  return (
    <div className="min-h-screen relative bg-orange-50/95 overflow-x-hidden bgbanner ">
      
      {/* Cursor image now added globally in Layout.jsx */}
      <div className="absolute top-[-90px] h-[250px] opacity-[1] left-[0px] z-30">
        <img
          src="/assets/flowers.png"
          alt="flower"
          className="w-[100%] h-[100%]"
        />
      </div>
      <div className="absolute  top-[-90px] h-[250px] opacity-[1] right-[0px] z-30">
        <img
          src="/assets/r-flowers.png"
          alt="flower"
          className="w-[100%] h-[100%] "
        />
      </div>
      <div className="absolute w-[600px] h-[600px] bottom-[20%] opacity-[.2] right-[-350px] z-10">
        <img
          src="/assets/rotatebg.png"
          alt=""
          className="w-[100%] h-[100%] spin-slow"
        />
      </div>
      <div className="cloudbanner">
        {/* Hero Section */}
        <section className="relative  py-16 md:py-24 overflow-hidden z-20">
          {/* <div className="absolute w-[600px] h-[600px] bottom-[10%] opacity-[.2] left-[0px] z-10">
          <img
            src="/assets/heroback.png"
            alt="image"
            className="w-[100%] h-[100%]"
          />
        </div> */}
          {/* Content Container */}
          <div className="relative z-30 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center ">
            {/* Left Column: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left relative z-30"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 drop-shadow-lg">
                Sri Bhaktha Hanuman Temple
              </h1>
              <p className="text-2xl md:text-3xl text-red-700 font-serif mb-4">
                Indiana
              </p>
              <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8">
                A sacred sanctuary of devotion, prayer, and community service
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
                <Link to={createPageUrl("PujaBooking")}>
                  <Button className="border-2 border-orange-500  hover:bg-transparent hover:text-orange-500 focus:ring-[none] bg-orange-500 px-8 py-3 text-lg rounded-full transition-colors">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Puja
                  </Button>
                </Link>
                <Link to={createPageUrl("Donations")}>
                  <Button className="border-2 border-orange-500  hover:bg-transparent hover:text-orange-500 focus:ring-[none] bg-orange-500 px-8 py-3 text-lg rounded-full transition-colors">
                    <Coins className="w-5 h-5 mr-2" />
                    Donate
                  </Button>
                </Link>
                <Link to={createPageUrl("Volunteer")}>
                  <Button className="border-2 border-orange-500  hover:bg-transparent hover:text-orange-500 focus:ring-[none] bg-orange-500 px-8 py-3 text-lg rounded-full transition-colors">
                    <Users className="w-5 h-5 mr-2" />
                    Volunteer
                  </Button>
                </Link>
              </div>

              <div className="max-w-xl mx-auto lg:mx-0 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-800">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <div className="text-sm">
                      <div className="font-semibold">Daily Open</div>
                      <div>9AM-11:30AM, 6PM-8:30PM</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-800">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <div className="text-sm">
                      <div className="font-semibold">Contact</div>
                      <div>248-525-8917</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-800">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <div className="text-sm">
                      <div className="font-semibold">Location</div>
                      <div>Fishers, IN</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Image Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="h-[400px] md:h-[600px] w-full"
            >
              <HeroCarousel images={carouselImages} />
            </motion.div>
          </div>
        </section>

        {/* Temple Services Section */}
        <section className="py-16 px-4 z-30 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Temple Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience divine blessings through our traditional pujas and
                community programs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-lg overflow-hidden group">
                  <div className="h-40 overflow-hidden">
                    <img
                      src="/assets/Poojasponsorship.jpeg" // Local image path
                      alt="Puja offering"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-gray-800">
                      Puja Booking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      Book traditional pujas including Abhishekam, Archana, and
                      special ceremonies
                    </p>
                    <Link to={createPageUrl("PujaBooking")}>
                      <Button className="border-2 border-orange-500 text-[#ea580c] hover:bg-orange-500 hover:text-orange-500 hover:bg-transparent bg-orange-500 w-full transition-colors">
                        Book Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-lg overflow-hidden group">
                  <div className="h-40 overflow-hidden">
                    <img
                      src="/assets/donation1.png" // Local image path
                      alt="Donation being made"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-gray-800">
                      Donations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      Support temple activities through general donations,
                      sponsorships, and seva
                    </p>
                    <Link to={createPageUrl("Donations")}>
                      <Button className="border-2 border-orange-500 text-[#ea580c] hover:bg-orange-500 hover:text-orange-500 hover:bg-transparent bg-orange-500 w-full transition-colors">
                        Donate
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-lg overflow-hidden group">
                  <div className="h-40 overflow-hidden">
                    <img
                      src="/assets/volunteer.jpg" // Local image path
                      alt="Volunteer hands"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-gray-800">
                      Volunteer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      Join our community in serving through various temple
                      activities and events
                    </p>
                    <Link to={createPageUrl("Volunteer")}>
                      <Button className="border-2 border-orange-500 text-[#ea580c] hover:bg-orange-500 hover:text-orange-500 hover:bg-transparent bg-orange-500 w-full transition-colors">
                        Join Us
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Upcoming Events - Now from Google Calendar */}
        <section className="py-16 px-4 relative">
          <div className="absolute w-[600px] h-[600px] m-[auto] opacity-[.2] right-[55%] bottom-[0px] z-20">
            <img
              src="/assets/hanuman.png"
              alt=""
              className="w-[100%] h-[100%]"
            />
          </div>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Upcoming Events
              </h2>
              <p className="text-xl text-gray-600">
                Join us for upcoming festivals and community gatherings
              </p>
            </motion.div>

            {eventsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading upcoming events...</p>
              </div>
            ) : events.length > 0 ? (
              <>
                <div className="grid md:grid-cols-3 gap-8">
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-lg">
                        {event.image_url && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={event.image_url}
                              alt={event.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg mb-2 text-gray-800">
                            {event.title}
                          </h3>
                          {event.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {event.description}
                            </p>
                          )}
                          <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex justify-between items-center">
                              <span>
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold">
                                {event.time}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1 text-xs">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                          {event.googleCalendarLink && (
                            <div className="mt-4">
                              <a
                                href__={event.googleCalendarLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View in Calendar{" "}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link to={createPageUrl("EventsGalleries")}>
                    <Button variant="outline" className="px-8 py-3 text-lg">
                      View Full Calendar
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-600">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No upcoming events scheduled at this time.</p>
              </div>
            )}
          </div>
        </section>

        {/* Gallery Preview */}
        {galleryImages.length > 0 && (
          <section className="py-16 px-4 bg-orange-50/95 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Temple Gallery
                </h2>
                <p className="text-xl text-gray-600">
                  Glimpses of our sacred temple and community events
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <img
                      src={image.google_drive_link} // This will now come from your local backend, mapping to /assets
                      alt={image.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 text-white">
                        <h4 className="font-semibold">{image.title}</h4>
                        <p className="text-sm text-gray-200">
                          {image.category}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to={createPageUrl("EventsGalleries", { tab: "images" })}>
                  {" "}
                  {/* Example of passing params */}
                  <Button variant="outline" className="px-8 py-3 text-lg">
                    View Full Gallery
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
