import React, { useState, useEffect } from "react";
import MyPanchangamHomeWidget from "../components/temple/MyPanchangamHomeWidget.jsx";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/createPageUrl.js";
import { GoogleDriveImage, HeroImage, Events } from "../services/entities.js";
import { Button } from "../components/ui/button";
import CalendarMini from "../components/calendar/CalendarMini.jsx";

import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Calendar, Heart, Users, Coins, MapPin, Clock, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import HeroCarousel from "../components/home/HeroCarousel.jsx";
import CursorImageTrail from "../components/effects/CursorImageTrail.jsx";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [eventImages, setEventImages] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fallbackImages = [
    "/assets/hanumanphoto1.jpg",
    "/assets/hanumanphoto2.jpg",
    "/assets/temple1.jpg",
    "/assets/temple2.jpg",
  ];

  const GALLERY_FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID;
  const EVENT_FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID_EVENTS;
  const POSTER_FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID_POSTERS;
  const HERO_FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID_HERO;
  const API_KEY = import.meta.env.VITE_GDRIVE_KEY;

  useEffect(() => {
    const loadGoogleCalendarEvents = async () => {
      try {
        const response = await Events.fetchGoogleCalendarEvents();
        if (response.success && response.events) {
          setEvents(response.events.slice(0, 3));
        } else {
          console.error("Error loading Google Calendar events:", response.error);
          setEvents([]);
        }
      } catch (error) {
        console.error("Error loading Google Calendar events:", error);
        setEvents([]);
      }
      setEventsLoading(false);
    };

    const loadGoogleDriveImages = async () => {
      try {
        if (!API_KEY) {
          console.warn("Google Drive API key not found, using fallback images");
          setGalleryImages(
            fallbackImages.map((url, index) => ({
              id: `fallback-${index}`,
              title: `Temple Image ${index + 1}`,
              image_url: url,
              google_drive_link: url,
            }))
          );
          setHeroImages(
            fallbackImages.map((url, index) => ({
              id: `hero-${index}`,
              title: `Hero Image ${index + 1}`,
              image_url: url,
            }))
          );
          setEventImages(
            fallbackImages.map((url, index) => ({
              id: `event-${index}`,
              title: `Event Image ${index + 1}`,
              image_url: url,
              google_drive_link: url,
            }))
          );
          return;
        }

        let heroLoaded = false;
        let galleryLoaded = false;
        let eventsLoaded = false;

        if (HERO_FOLDER_ID) {
          try {
            const heroUrl = `https://www.googleapis.com/drive/v3/files?q='${HERO_FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,thumbnailLink,webViewLink)`;
            const heroResponse = await fetch(heroUrl);

            if (heroResponse.ok) {
              const heroData = await heroResponse.json();
              if (heroData.files && heroData.files.length > 0) {
                const formattedHeroImages = heroData.files.map((file) => ({
                  id: file.id,
                  title: file.name,
                  image_url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`,
                  google_drive_link: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
                  category: "Hero",
                }));
                setHeroImages(formattedHeroImages);
                heroLoaded = true;
              }
            } else {
              console.error("Hero API error:", await heroResponse.text());
            }
          } catch (error) {
            console.error("Error loading hero images:", error);
          }
        }

        if (GALLERY_FOLDER_ID) {
          try {
            const galleryUrl = `https://www.googleapis.com/drive/v3/files?q='${GALLERY_FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,thumbnailLink,webViewLink)`;
            const galleryResponse = await fetch(galleryUrl);

            if (galleryResponse.ok) {
              const galleryData = await galleryResponse.json();
              if (galleryData.files && galleryData.files.length > 0) {
                const formattedGalleryImages = galleryData.files.map((file) => ({
                  id: file.id,
                  title: file.name,
                  image_url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w600`,
                  google_drive_link: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
                  category: "Gallery",
                }));
                setGalleryImages(formattedGalleryImages);
                galleryLoaded = true;
              }
            } else {
              console.error("Gallery API error:", await galleryResponse.text());
            }
          } catch (error) {
            console.error("Error loading gallery images:", error);
          }
        }

        if (EVENT_FOLDER_ID) {
          try {
            const eventsUrl = `https://www.googleapis.com/drive/v3/files?q='${EVENT_FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,thumbnailLink,webViewLink)`;
            const eventsResponse = await fetch(eventsUrl);

            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();
              if (eventsData.files && eventsData.files.length > 0) {
                const formattedEventImages = eventsData.files.map((file) => ({
                  id: file.id,
                  title: file.name,
                  image_url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w600`,
                  google_drive_link: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
                  category: "Events",
                }));
                setEventImages(formattedEventImages);
                eventsLoaded = true;
              }
            } else {
              console.error("Events API error:", await eventsResponse.text());
            }
          } catch (error) {
            console.error("Error loading event images:", error);
          }
        }

        console.log("Image loading completed. Loaded:", { heroLoaded, galleryLoaded, eventsLoaded });
      } catch (error) {
        console.error("Error loading Google Drive images:", error);
        setHeroImages(
          fallbackImages.map((url, index) => ({
            id: `hero-${index}`,
            title: `Hero Image ${index + 1}`,
            image_url: url,
          }))
        );
        setGalleryImages(
          fallbackImages.map((url, index) => ({
            id: `fallback-${index}`,
            title: `Temple Image ${index + 1}`,
            image_url: url,
            google_drive_link: url,
          }))
        );
        setEventImages(
          fallbackImages.map((url, index) => ({
            id: `event-${index}`,
            title: `Event Image ${index + 1}`,
            image_url: url,
            google_drive_link: url,
          }))
        );
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadGoogleDriveImages(), loadGoogleCalendarEvents()]);
      setLoading(false);
    };

    loadData();
  }, [GALLERY_FOLDER_ID, EVENT_FOLDER_ID, HERO_FOLDER_ID, API_KEY]);

  const carouselImages = heroImages.length > 0 ? heroImages.map((img) => img.image_url) : [];
  const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID || "";

  return (
    <div className="min-h-screen relative bg-orange-50/95 overflow-x-hidden bgbanner ">
      <div className="absolute top-[-90px] h-[250px] opacity-[1] left-[0px] z-30">
        <img src="/assets/flowers.png" alt="flower" className="w-[100%] h-[100%]" />
      </div>
      <div className="absolute  top-[-90px] h-[250px] opacity-[1] right-[0px] z-30">
        <img src="/assets/r-flowers.png" alt="flower" className="w-[100%] h-[100%] " />
      </div>
      <div className="absolute w-[600px] h-[600px] bottom-[20%] opacity-[.2] right-[-350px] z-10">
        <img src="/assets/rotatebg.png" alt="" className="w-[100%] h-[100%] spin-slow" />
      </div>

      <div className="cloudbanner">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden z-20">
          <div className="relative z-30 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left relative z-30"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 drop-shadow-lg">
                Sri Bhaktha Hanuman Temple
              </h1>
              <p className="text-2xl md:text-3xl text-red-700 font-serif mb-4">Indiana</p>
              <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8">
                A sacred sanctuary of devotion, prayer, and community service
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
                <Link to={createPageUrl("PujaBooking")}>
                  <Button className="border-2 border-orange-500 hover:bg-transparent hover:text-orange-500 focus:ring-[none] bg-orange-500 px-8 py-3 text-lg rounded-full transition-colors">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Puja
                  </Button>
                </Link>
                <a href="https://hanumantempleindiana.square.site/" target="_blank" rel="noopener noreferrer">
                  <Button className="border-2 border-orange-500 hover:bg-transparent hover:text-orange-500 focus:ring-[none] bg-orange-500 px-8 py-3 text-lg rounded-full transition-colors">
                    <Coins className="w-5 h-5 mr-2" />
                    Donate
                  </Button>
                </a>
                <Link to={createPageUrl("Volunteer")}>
                  <Button className="border-2 border-orange-500 hover:bg-transparent hover:text-orange-500 focus:ring-[none] bg-orange-500 px-8 py-3 text-lg rounded-full transition-colors">
                    <Users className="w-5 h-5 mr-2" />
                    Volunteer
                  </Button>
                </Link>
                <a href="https://hanumantempleindiana.square.site/" target="_blank" rel="noopener noreferrer">
                  <Button className="border-2 border-orange-500 hover:bg-transparent hover:text-orange-500 focus:ring-[none] bg-orange-500 px-8 py-3 text-lg rounded-full transition-colors">
                    <Heart className="w-5 h-5 mr-2" />
                    Become a Sponsor
                  </Button>
                </a>
              </div>

              {/* ✅ CLEAN + MINIMAL (NO CONTACT) */}
              <div className="max-w-xl mx-auto lg:mx-0">
                <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm px-5 py-4">
                  <div className="grid gap-4 md:grid-cols-2 items-start">
                    {/* Hours */}
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 rounded-xl bg-orange-50 p-2">
                        <Clock className="h-5 w-5 text-orange-500" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-800 text-start">Hours</div>

                        <div className="mt-1 space-y-1 text-sm">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-gray-700 font-medium">Weekdays:</span>
                            <span className="text-orange-600 font-semibold">
                              9AM–11:30AM, 6PM–8:30PM
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-gray-700 font-medium">Weekends:</span>
                            <span className="text-orange-600 font-semibold">
                              9AM–11:30AM, 6PM–8:30PM
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 rounded-xl bg-orange-50 p-2">
                        <MapPin className="h-5 w-5 text-orange-500" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-800">Location</div>

                        <a
                          href="https://www.google.com/maps/search/?api=1&query=Sri%20Bhaktha%20Hanuman%20Temple%20Fishers%20IN"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-orange-600 transition-colors"
                        >
                          Fishers, IN <ExternalLink className="h-4 w-4 opacity-70" />
                        </a>

                        <div className="mt-1 text-xs text-gray-500">Tap to open directions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ✅ end minimal block */}
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

        {/* ✅ Panchangam — below Hero */}
        <MyPanchangamHomeWidget />

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
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Temple Services</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience divine blessings through our traditional pujas and community programs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-lg overflow-hidden group">
                  <div className="h-40 overflow-hidden">
                    <img
                      src="/assets/Poojasponsorship3.jpeg"
                      alt="Puja offering"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-gray-800">Puja Booking</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      Book traditional pujas including Abhishekam, Archana, and special ceremonies
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
                      src="/assets/donation1.png"
                      alt="Donation being made"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-gray-800">Donations</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      Support temple activities through general donations, sponsorships, and seva
                    </p>
                    <a href="https://hanumantempleindiana.square.site/" target="_blank" rel="noopener noreferrer">
                      <Button className="border-2 border-orange-500 text-[#ea580c] hover:bg-orange-500 hover:text-orange-500 hover:bg-transparent bg-orange-500 w-full transition-colors">
                        Donate
                      </Button>
                    </a>
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
                      src="/assets/volunteer.jpg"
                      alt="Volunteer hands"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-gray-800">Volunteer</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      Join our community in serving through various temple activities and events
                    </p>
                    <Link to={createPageUrl("Volunteer")}>
                      <Button className="border-2 border-orange-500 text-[#ea580c] hover:bg-orange-500 hover:text-orange-500 hover:bg-transparent bg-orange-500 w-full transition-colors">
                        Join Us
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
                      src="/assets/garland.jpg"
                      alt="Volunteer hands"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-gray-800">Fresh Garland Order</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      Join our community in serving through various temple activities and events
                    </p>
                    <Link to={createPageUrl("Garland")}>
                      <Button className="border-2 border-orange-500 text-[#ea580c] hover:bg-orange-500 hover:text-orange-500 hover:bg-transparent bg-orange-500 w-full transition-colors">
                        Order Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Schedules & Events */}
        <section className="py-16 px-4 bg-white ">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Schedules & Events</h2>
              <p className="text-xl text-gray-600">Stay updated with our temple calendar and event gallery</p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* LEFT SIDE – CALENDAR */}
              <div className="w-full lg:w-1/3">
                <div className="p-4 rounded-xl shadow-lg border bg-white relative overflow-hidden">
                  {(() => {
                    const ctz = "America/Indiana/Indianapolis";
                    const src = encodeURIComponent(calendarId);

                    const pad2 = (n) => String(n).padStart(2, "0");
                    const now = new Date();
                    const y = now.getFullYear();
                    const m = pad2(now.getMonth() + 1);
                    const d = pad2(now.getDate());
                    const ymd = `${y}${m}${d}`;

                    const embedUrl =
                      `https://calendar.google.com/calendar/embed?` +
                      `src=${src}&ctz=${ctz}&mode=AGENDA&dates=${ymd}/${ymd}` +
                      `&showTitle=0&showNav=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0`;

                    const openUrl = `https://calendar.google.com/calendar/u/0/r/day?cid=${src}`;

                    return (
                      <>
                        <a
                          className="oWHwWc"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open Calendar, Temple Events in new window"
                          aria-label="Open Calendar, Temple Events in new window"
                          href={openUrl}
                        >
                          <svg
                            className="hmuWb"
                            viewBox="0 0 24 24"
                            focusable="false"
                            style={{
                              width: "50px",
                              height: "50px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "absolute",
                              right: "10px",
                              top: "10px",
                              background: "#0000002d",
                              padding: "10px",
                              color: "white",
                            }}
                          >
                            <path d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
                          </svg>
                        </a>

                        <iframe
                          src={embedUrl}
                          frameBorder="0"
                          height={500}
                          width="100%"
                          allowFullScreen
                          title="Temple Calendar"
                        />
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* RIGHT SIDE – EVENT PHOTOS */}
              <div className="w-full lg:w-2/3">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Recent Events</h3>
                    <p className="text-gray-600">Images from our latest temple events and celebrations</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-2 relative z-30">
                    {eventImages.length > 0
                      ? eventImages.slice(0, 6).map((image) => (
                          <motion.div
                            key={image.id}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedImage(image)}
                            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer aspect-square group"
                          >
                            <img
                              src={image.image_url}
                              alt={image.title}
                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                          </motion.div>
                        ))
                      : fallbackImages.slice(0, 4).map((image, index) => (
                          <motion.div
                            key={`fallback-${index}`}
                            whileHover={{ scale: 1.05 }}
                            className="relative overflow-hidden rounded-lg shadow-md aspect-square group"
                          >
                            <img
                              src={image}
                              alt={`Temple Image ${index + 1}`}
                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                          </motion.div>
                        ))}
                  </div>

                  <div className="mt-8 text-center">
                    <a
                      href="https://hanumantempleindiana.square.site/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="float-start inline-block border-2 border-orange-500 hover:bg-transparent hover:text-orange-500 bg-orange-500 text-white px-8 py-3 text-lg rounded-full transition-colors"
                    >
                      🤝 Become a Sponsor
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Popup Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50" onClick={() => setSelectedImage(null)}>
            <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-white hover:text-gray-200 text-3xl font-bold transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="w-full h-full pt-16 flex items-center justify-center">
                <img src={selectedImage.image_url} alt={selectedImage.title} className="max-w-[95%] max-h-[90%] object-contain" />
              </div>
            </div>
          </div>
        )}

        {/* Gallery Preview */}
        <section className="py-16 px-4 bg-orange-50/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Temple Gallery</h2>
              <p className="text-xl text-gray-600">Glimpses of our sacred temple and community events</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(galleryImages.length > 0
                ? galleryImages
                : fallbackImages.map((url, index) => ({
                    id: `fallback-${index}`,
                    title: `Temple Image ${index + 1}`,
                    image_url: url,
                    google_drive_link: url,
                    category: "Gallery",
                  }))
              )
                .slice(0, 6)
                .map((image, index) => (
                  <Link key={image.id} to={createPageUrl("EventsGalleries")}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </motion.div>
                  </Link>
                ))}
            </div>

            <div className="text-center mt-12">
              <Link to={createPageUrl("EventsGalleries", { tab: "images" })}>
                <Button
                  variant="outline"
                  className="float-center inline-block border-2 border-orange-500 hover:bg-transparent hover:text-orange-500 bg-orange-500 text-white px-8 py-3 text-lg rounded-full transition-colors"
                >
                  View Full Gallery
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}