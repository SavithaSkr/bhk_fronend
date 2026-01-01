import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Video, Image as ImageIcon, Radio } from "lucide-react";
import { VideoGalleryItem, Events } from "../services/entities.js";
import VideoPlayer from "../components/galleries/VideoPlayer.jsx";
import ImageLightbox from "../components/galleries/ImageLightbox.jsx";
import CalendarMini from "../components/calendar/CalendarMini.jsx";
import BookingCalendar from "../components/calendar/BookingCalendar.jsx";

// Placeholder Shadcn components for local setup
/*  const Button = ({ children, className, onClick }) => (
  <button
    className={px-4 py-2 rounded-md bg-blue-500 text-white ${className}}
     onClick={onClick}
  >
    {children}
   </button>
 ); */
/* const Card = ({ children, className }) => (
  <div className={border rounded-lg shadow-sm ${className}}>{children}</div>
);
const CardContent = ({ children, className }) => (
  <div className={p-4 ${className}}>{children}</div>
); */

export default function EventsGalleriesPage() {
  const [activeTab, setActiveTab] = useState("events");
  const [eventImages, setEventImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const GALLERY_FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID;
  const EVENT_FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID_EVENTS;
  const API_KEY = import.meta.env.VITE_GDRIVE_KEY;
  const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
  const BOOKING_LINK = import.meta.env.VITE_BOOKING_LINK;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");
    if (tabParam) setActiveTab(tabParam);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load gallery images
      if (GALLERY_FOLDER_ID && API_KEY) {
        const galleryResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${GALLERY_FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,thumbnailLink,webViewLink)`
        );
        if (galleryResponse.ok) {
          const galleryData = await galleryResponse.json();
          const formattedGalleryImages = galleryData.files.map((file) => ({
            id: file.id,
            title: file.name,
            google_drive_link: `https://drive.google.com/thumbnail?id=${file.id}&sz=w600`,
            thumbnail: `https://drive.google.com/thumbnail?id=${file.id}&sz=w300`,
            viewLink: file.webViewLink,
          }));
          setGalleryImages(formattedGalleryImages);
        }
      }

      // Load event images
      if (EVENT_FOLDER_ID && API_KEY) {
        const eventResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${EVENT_FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,thumbnailLink,webViewLink)`
        );
        if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          const formattedEventImages = eventData.files.map((file) => ({
            id: file.id,
            title: file.name,
            google_drive_link: `https://drive.google.com/thumbnail?id=${file.id}&sz=w600`,
            thumbnail: `https://drive.google.com/thumbnail?id=${file.id}&sz=w300`,
            viewLink: file.webViewLink,
          }));
          setEventImages(formattedEventImages);
        }
      }
    } catch (error) {
      console.error("Error loading images:", error);
    }
    setLoading(false);
  };

  const renderContent = () => {
    if (loading && (activeTab === "images" || activeTab === "videos")) {
      return (
        <div className="p-8 py-12 text-center bg-white/80 backdrop-blur-sm rounded-xl">
          Loading gallery content...
        </div>
      );
    }

    switch (activeTab) {
      case "events":
        return ( 
        <EventsSection 
            images={eventImages}
            onImageClick={setSelectedImage}
        />
        );
      case "images":
        return (
          <ImageGallerySection
            images={galleryImages}
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
    <div className="relative min-h-screen overflow-x-hidden bg-transparent">
      <div className="absolute w-[600px] h-[600px] bottom-[20%] opacity-[.2] right-[-350px] z-10">
        <img
          src="/assets/rotatebg.png"
          alt=""
          className="w-[100%] h-[100%] spin-slow"
        />
      </div>

      {/* Header Section */}
      <section className="px-4 py-12 bg-orange-50/95 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto text-center max-w-7xl"
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            Events & Galleries
          </h1>
          <p className="text-xl text-gray-600">
            Explore upcoming events and cherish moments from our galleries.
          </p>
        </motion.div>
      </section>

      {/* Main Section */}
      <div className="relative z-20 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Facebook Live Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="p-6 text-center border shadow-lg bg-white/90 backdrop-blur-sm rounded-xl border-white/20">
              <h2 className="flex items-center justify-center gap-3 mb-4 text-3xl font-bold text-gray-800">
                <Radio className="text-red-500 animate-pulse" />
                Watch Us Live
              </h2>
              <p className="max-w-3xl mx-auto mb-6 text-gray-600">
                Join our pujas and special events live from anywhere. Tune in to
                our Facebook stream below during scheduled event times.
              </p>
              <div className="relative overflow-hidden bg-black rounded-lg shadow-xl aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href__=https%3A%2F%2Fwww.facebook.com%2Ffacebook&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
                  width="500"
                  height="500"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Replace the above link with your Facebook page URL.
              </p>
            </div>
          </motion.div>

          <div className="flex justify-center mb-8 bg-white rounded shadow-md p-1.5">
            <BookingCalendar calendarId={CALENDAR_ID} bookingLink={BOOKING_LINK} eyebrow={'Baktha Hanuman Events'} title={'Booked Events'} subtitle={'Booked Temple Events'}/>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 bg-white rounded-full shadow-md p-1.5">
            <TabButton
              id="events"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              icon={<Calendar />}
              label="Events "
            />
            <TabButton
              id="images"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              icon={<ImageIcon />}
              label="Image Gallery"
            />
            {/* <TabButton
              id="videos"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              icon={<Video />}
              label="Video Gallery"
            /> */}
          </div>

          <div>{renderContent()}</div>
        </div>
      </div>

      {/* Image Lightbox */}
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

// const EventsSection = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await Events.fetchGoogleCalendarEvents();
//         if (response.success && response.events) setEvents(response.events);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   if (loading)
//     return (
//       <div className="p-8 py-12 text-center bg-white/80 backdrop-blur-sm rounded-xl">
//         <div className="w-8 h-8 mx-auto mb-4 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
//         <p>Loading events...</p>
//       </div>
//     );

//   if (events.length === 0)
//     return (
//       <div className="p-8 py-12 text-center text-gray-600 bg-white/80 backdrop-blur-sm rounded-xl">
//         <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
//         <p>No upcoming events scheduled at this time.</p>


//       </div>
//     );

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {events.map((event) => (
//           <Card key={event.id} className="overflow-hidden shadow-md">
//             {event.image_url && (
//               <img
//                 src={event.image_url}
//                 alt={event.title}
//                 className="object-cover w-full h-40"
//               />
//             )}
//             <CardContent>
//               <h4 className="text-lg font-bold text-gray-900">{event.title}</h4>
//               <p className="mt-1 text-sm text-gray-600">
//                 {new Date(event.date).toLocaleDateString()}
//               </p>
//               <p className="text-sm text-gray-600">{event.time}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </motion.div>
//   );
// };

const EventsSection = ({ images, onImageClick }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    {images.length > 0 ? (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <motion.div
            key={image.id}
            layoutId={`image-${image.id}`}
            whileHover={{ scale: 1.03 }}
            onClick={() => onImageClick(image.google_drive_link)}
            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer aspect-square group"
          >
            <img
              src={image.google_drive_link}
              alt={image.title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
            {/* <div className="absolute bottom-0 left-0 right-0 p-2 text-sm text-white transition-opacity opacity-0 bg-black/50 group-hover:opacity-100">
              {image.title}
            </div> */}
          </motion.div>
        ))}
      </div>
    ) : (
      
      <p className="py-8 text-center text-gray-600">
        The Event gallery is empty. Please check back soon!
      </p>
    )}
  </motion.div> 
);

const ImageGallerySection = ({ images, onImageClick }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    {images.length > 0 ? (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <motion.div
            key={image.id}
            layoutId={`image-${image.id}`}
            whileHover={{ scale: 1.03 }}
            onClick={() => onImageClick(image.google_drive_link)}
            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer aspect-square group"
          >
            <img
              src={image.google_drive_link}
              alt={image.title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
            {/* <div className="absolute bottom-0 left-0 right-0 p-2 text-sm text-white transition-opacity opacity-0 bg-black/50 group-hover:opacity-100">
              {image.title}
            </div> */}
          </motion.div>
        ))}
      </div>
    ) : (
      <p className="py-8 text-center text-gray-600">
        The image gallery is empty. Please check back soon!
      </p>
    )}
  </motion.div>
);

const VideoGallerySection = ({ videos }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    {videos.length > 0 ? (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden shadow-lg">
            <VideoPlayer youtubeUrl={video.youtube_url} />
            <CardContent>
              <h4 className="text-lg font-bold text-gray-900">{video.title}</h4>
              {video.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {video.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <p className="py-8 text-center text-gray-600">
        The video gallery is empty. Please check back soon!
      </p>
    )}
  </motion.div>
);
