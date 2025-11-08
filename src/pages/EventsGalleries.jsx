import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// Assuming you will copy Button, Card, CardContent to your components/ui folder
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Video, Image as ImageIcon, Radio } from "lucide-react";
import {
  VideoGalleryItem,
  GoogleDriveImage,
  Events,
} from "../services/entities.js"; // Updated import path
import VideoPlayer from "../components/galleries/VideoPlayer.jsx"; // Updated import path
import ImageLightbox from "../components/galleries/ImageLightbox.jsx"; // Updated import path

// Placeholder Shadcn components for local setup
const Button = ({ children, className, onClick }) => (
  <button
    className={`px-4 py-2 rounded-md bg-blue-500 text-white ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);
const Card = ({ children, className }) => (
  <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>
);
const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export default function EventsGalleriesPage() {
  const [activeTab, setActiveTab] = useState("events");
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Read tab from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [videosData, imagesData] = await Promise.all([
        VideoGalleryItem.list("-created_date"), // Fetches from local backend
        GoogleDriveImage.list("-created_date"), // Fetches from local backend
      ]);
      setVideos(videosData);
      setImages(imagesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const renderContent = () => {
    // Show a general loading state for all gallery content
    if (loading && (activeTab === "images" || activeTab === "videos")) {
      return (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm p-8 rounded-xl">
          Loading gallery content...
        </div>
      );
    }

    switch (activeTab) {
      case "events":
        return <EventsSection />;
      case "images":
        return (
          <ImageGallerySection
            images={images}
            onImageClick={setSelectedImage}
          />
        );
      case "videos":
        return <VideoGallerySection videos={videos} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden relative">
      <div className="absolute w-[600px] h-[600px] bottom-[20%] opacity-[.2] right-[-350px] z-10">
        <img
          src="/assets/rotatebg.png"
          alt=""
          className="w-[100%] h-[100%] spin-slow"
        />
      </div>
      <section className="bg-orange-50/95 backdrop-blur-sm py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Events & Galleries
          </h1>
          <p className="text-xl text-gray-600">
            Explore upcoming events and cherish moments from our galleries.
          </p>
        </motion.div>
      </section>

      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Facebook Live Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                <Radio className="text-red-500 animate-pulse" />
                Watch Us Live
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-6">
                Join our pujas and special events live from anywhere. Tune in to
                our Facebook stream below during scheduled event times.
              </p>

              <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg shadow-xl overflow-hidden relative">
                <iframe
                  // IMPORTANT: Replace the URL in href__="..." with your own Facebook page URL.
                  // For example: href__=https%3A%2F%2Fwww.facebook.com%2FYourPageName
                  src="https://www.facebook.com/plugins/page.php?href__=https%3A%2F%2Fwww.facebook.com%2Ffacebook&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
                  width="500"
                  height="500"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="w-full h-full absolute top-0 left-0"
                ></iframe>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                This is a placeholder feed. You will need to update the code
                with your temple's Facebook page URL for it to work correctly.
              </p>
            </div>
          </motion.div>

          <div className="flex justify-center mb-8 bg-white rounded-full shadow-md p-1.5">
            <TabButton
              id="events"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              icon={<Calendar />}
              label="Events Calendar"
            />
            <TabButton
              id="images"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              icon={<ImageIcon />}
              label="Image Gallery"
            />
            <TabButton
              id="videos"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              icon={<Video />}
              label="Video Gallery"
            />
          </div>

          <div>{renderContent()}</div>
        </div>
      </div>
      <ImageLightbox
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}

const TabButton = ({ id, activeTab, setActiveTab, icon, label }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full md:w-auto flex-1 md:flex-none px-4 py-2.5 text-sm md:text-base font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
      activeTab === id
        ? "bg-orange-500 text-white shadow-lg"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await Events.fetchGoogleCalendarEvents();
        if (response.success && response.events) {
          setEvents(response.events);
        } else {
          console.error("Failed to fetch events:", response.error);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 bg-white/80 backdrop-blur-sm p-8 rounded-xl">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 bg-white/80 backdrop-blur-sm p-8 rounded-xl">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>No upcoming events scheduled at this time.</p>
        <p className="text-sm mt-2">
          Ensure your Google Calendar API key and Calendar ID are configured in
          the backend's .env file and the calendar is public.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Temple Events Calendar
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View all our upcoming pujas, festivals, and special events. You can
          add these events to your own calendar to stay updated!
        </p>
      </div>
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm p-1 md:p-2">
        {/* Render events from fetched data instead of embedding Google Calendar directly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="h-full shadow-md overflow-hidden">
              {event.image_url && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <h4 className="font-bold text-lg text-gray-900">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">{event.time}</p>
                {event.location && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </p>
                )}
                {event.googleCalendarLink && (
                  <a
                    href__={event.googleCalendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm mt-2 inline-flex items-center gap-1 hover:underline"
                  >
                    View Event <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

const ImageGallerySection = ({ images, onImageClick }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    {images.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <motion.div
            key={image.id}
            layoutId={`image-${image.id}`}
            whileHover={{ scale: 1.03 }}
            onClick={() => onImageClick(image.google_drive_link)} // This will now come from your local backend, mapping to /assets
            className="cursor-pointer overflow-hidden rounded-lg shadow-md aspect-square group relative"
          >
            <img
              src={image.google_drive_link}
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {image.title}
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-600 py-8">
        The image gallery is empty. Please check back soon!
      </p>
    )}
  </motion.div>
);

const VideoGallerySection = ({ videos }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    {videos.length > 0 ? (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <Card
            key={video.id}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <VideoPlayer youtubeUrl={video.youtube_url} />
            <CardContent className="p-4">
              <h4 className="font-bold text-lg text-gray-900">{video.title}</h4>
              {video.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {video.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-600 py-8">
        The video gallery is empty. Please check back soon!
      </p>
    )}
  </motion.div>
);
