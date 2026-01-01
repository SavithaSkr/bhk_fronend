import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/createPageUrl.js"; // Updated import path
import { GoogleDriveImage, HeroImage, Events } from "../services/entities.js"; // Updated import path for API calls
// Assuming you will copy Button, Card, CardContent, CardHeader, CardTitle to your components/ui folder
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../components/ui/button";
import CalendarMini from "../components/calendar/CalendarMini.jsx"; // Updated import path

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
  const [eventImages, setEventImages] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fallback images when no Google Drive images are available
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
        // Use fallback images if no API key is configured
        if (!API_KEY) { 
          console.warn("Google Drive API key not found, using fallback images");
          setGalleryImages(fallbackImages.map((url, index) => ({
            id: `fallback-${index}`,
            title: `Temple Image ${index + 1}`,
            image_url: url,
            google_drive_link: url,
          })));
          setHeroImages(fallbackImages.map((url, index) => ({
            id: `hero-${index}`,
            title: `Hero Image ${index + 1}`,
            image_url: url,
          })));
          setEventImages(fallbackImages.map((url, index) => ({
            id: `event-${index}`,
            title: `Event Image ${index + 1}`,
            image_url: url,
            google_drive_link: url,
          })));
          return;
        }

        console.log('Loading images with API key:', API_KEY);
        console.log('Folder IDs:', { HERO_FOLDER_ID, GALLERY_FOLDER_ID, EVENT_FOLDER_ID });

        let heroLoaded = false;
        let galleryLoaded = false;
        let eventsLoaded = false;

        // Load hero images from hero folder
        if (HERO_FOLDER_ID) {
          try {
            const heroUrl = `https://www.googleapis.com/drive/v3/files?q='${HERO_FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,thumbnailLink,webViewLink)`;
            console.log('Hero API URL:', heroUrl);
            
            const heroResponse = await fetch(heroUrl);
            console.log('Hero response status:', heroResponse.status);
            
            if (heroResponse.ok) {
              const heroData = await heroResponse.json();
              console.log('Hero data:', heroData);
              
              if (heroData.files && heroData.files.length > 0) {
                const formattedHeroImages = heroData.files.map((file) => ({
                  id: file.id,
                  title: file.name,
                  image_url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`,
                  google_drive_link: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
                  category: 'Hero'
                }));
                setHeroImages(formattedHeroImages);
                heroLoaded = true;
                console.log('Hero images loaded:', formattedHeroImages.length);
              }
            } else {
              const errorText = await heroResponse.text();
              console.error('Hero API error:', errorText);
            }
          } catch (error) {
            console.error("Error loading hero images:", error);
          }
        }

        // Load gallery images
        if (GALLERY_FOLDER_ID) {
          try {
            const galleryUrl = `https://www.googleapis.com/drive/v3/files?q='${GALLERY_FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,thumbnailLink,webViewLink)`;
            // console.log('Gallery API URL:', galleryUrl);
            
            const galleryResponse = await fetch(galleryUrl);
            // console.log('Gallery response status:', galleryResponse.status);
            
            if (galleryResponse.ok) {
              const galleryData = await galleryResponse.json();
              console.log('Gallery data:', galleryData);
              
              if (galleryData.files && galleryData.files.length > 0) {
                const formattedGalleryImages = galleryData.files.map((file) => ({
                  id: file.id,
                  title: file.name,
                  image_url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w600`,
                  google_drive_link: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
                  category: 'Gallery'
                }));
                setGalleryImages(formattedGalleryImages);
                galleryLoaded = true;
                // console.log('Gallery images loaded:', formattedGalleryImages.length);
              }
            } else {
              const errorText = await galleryResponse.text();
              console.error('Gallery API error:', errorText);
            }
          } catch (error) {
            console.error("Error loading gallery images:", error);
          }
        }

        // Load event images from events folder
        if (EVENT_FOLDER_ID) {
          try {
            const eventsUrl = `https://www.googleapis.com/drive/v3/files?q='${EVENT_FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,thumbnailLink,webViewLink)`;
            // console.log('Events API URL:', eventsUrl);
            
            const eventsResponse = await fetch(eventsUrl);
            // console.log('Events response status:', eventsResponse.status);
            
            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();
              // console.log('Events data:', eventsData);
              
              if (eventsData.files && eventsData.files.length > 0) {
                const formattedEventImages = eventsData.files.map((file) => ({
                  id: file.id,
                  title: file.name,
                  image_url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w600`,
                  google_drive_link: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
                  category: 'Events'
                }));
                setEventImages(formattedEventImages);
                eventsLoaded = true;
                // console.log('Event images loaded:', formattedEventImages.length);
              }
            } else {
              const errorText = await eventsResponse.text();
              console.error('Events API error:', errorText);
            }
          } catch (error) {
            console.error("Error loading event images:", error);
          }
        }

        // Don't use fallback images if API call succeeded - let sections handle their own states
        console.log('Image loading completed. Loaded:', { heroLoaded, galleryLoaded, eventsLoaded });
      } catch (error) {
        console.error("Error loading Google Drive images:", error);
        // Use fallback images only on API error
        setHeroImages(fallbackImages.map((url, index) => ({
          id: `hero-${index}`,
          title: `Hero Image ${index + 1}`,
          image_url: url,
        })));
        setGalleryImages(fallbackImages.map((url, index) => ({
          id: `fallback-${index}`,
          title: `Temple Image ${index + 1}`,
          image_url: url,
          google_drive_link: url,
        })));
        setEventImages(fallbackImages.map((url, index) => ({
          id: `event-${index}`,
          title: `Event Image ${index + 1}`,
          image_url: url,
          google_drive_link: url,
        })));
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadGoogleDriveImages(), loadGoogleCalendarEvents()]);
      setLoading(false);
    };

    loadData();
  }, [GALLERY_FOLDER_ID, EVENT_FOLDER_ID, HERO_FOLDER_ID, API_KEY]);

  // Use Google Drive images if available, otherwise use fallback images
  const carouselImages = heroImages.length > 0 ? heroImages.map((img) => img.image_url) : [];

  // Images available in /public/assets to alternate in the trail
  const cursorImages = ["/assets/cursor.png", "/assets/cursor.png"];

  const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID || "";

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
                <a
                  href="https://hanumantempleindiana.square.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="border-2 border-orange-500  hover:bg-transparent hover:text-orange-500 focus:ring-[none] bg-orange-500 px-8 py-3 text-lg rounded-full transition-colors">
                    <Coins className="w-5 h-5 mr-2" />
                    Donate
                  </Button>
                </a>
                <Link to={createPageUrl("Volunteer")}>
                  <Button className="border-2 border-orange-500  hover:bg-transparent hover:text-orange-500 focus:ring-[none] bg-orange-500 px-8 py-3 text-lg rounded-full transition-colors">
                    <Users className="w-5 h-5 mr-2" />
                    Volunteer
                  </Button>
                </Link>
                <a
                  href="https://hanumantempleindiana.square.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="border-2 border-orange-500  hover:bg-transparent hover:text-orange-500 focus:ring-[none] bg-orange-500 px-8 py-3 text-lg rounded-full transition-colors">
                    <Heart className="w-5 h-5 mr-2" />
                    Become a Sponsor
                  </Button>
                </a>
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
                      src="/assets/Poojasponsorship3.jpeg" // Local image path
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
                    <a
                      href="https://hanumantempleindiana.square.site/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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

        {/* <section className="py-16 px-4 relative">
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
        </section> */}

        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Schedules & Events
              </h2>
              <p className="text-xl text-gray-600">
                Stay updated with our temple calendar and event gallery
              </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* LEFT SIDE – CALENDAR */}
              <div className="w-full lg:w-1/3">
                <div className="p-4 rounded-xl shadow-lg border bg-white">
                  <CalendarMini calendarId={calendarId} height={500} />
                </div>
              </div>

              {/* RIGHT SIDE – EVENT PHOTOS */}
              <div className="w-full lg:w-2/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Recent Events</h3>
                    <p className="text-gray-600">Images from our latest temple events and celebrations</p>
                  </div>
                  
                  {/* IMAGE GRID - Always show Google Drive images if loaded */}
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                    {eventImages.length > 0 ? (
                      eventImages.slice(0, 6).map((image) => (
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
                    ) : (
                      // Show fallback images only if no Google Drive images
                      fallbackImages.slice(0, 4).map((image, index) => (
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
                      ))
                    )}
                  </div>

                  {/* SPONSORSHIP BUTTON */}
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
          <div 
            className="fixed inset-0 bg-black bg-opacity-95 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with close button */}
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
              
              {/* Image container */}
              <div className="w-full h-full pt-16 flex items-center justify-center">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="max-w-[95%] max-h-[90%] object-contain"
                />
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
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Temple Gallery
              </h2>
              <p className="text-xl text-gray-600">
                Glimpses of our sacred temple and community events
              </p>
            </motion.div>

            {/* Show gallery images if available, otherwise show fallback */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(galleryImages.length > 0 ? galleryImages : fallbackImages.map((url, index) => ({
                id: `fallback-${index}`,
                title: `Temple Image ${index + 1}`,
                image_url: url,
                google_drive_link: url,
                category: 'Gallery'
              }))).map((image, index) => (
                <motion.div
                  key={image.id}
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
      </div>
    </div>
  );
}
