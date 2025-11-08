import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";

import HomePage from "./pages/Home.jsx";
import AboutPage from "./pages/About.jsx";
import PujaBookingPage from "./pages/PujaBooking.jsx";
import PriestBookingPage from "./pages/PriestBooking.jsx";
import DonationsPage from "./pages/Donations.jsx";
import EventsGalleriesPage from "./pages/EventsGalleries.jsx";
import VolunteerPage from "./pages/Volunteer.jsx";
import ContactPage from "./pages/Contact.jsx";
import HeroImageManagement from "./pages/HeroImageManagement.jsx"; // Admin page

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentPageName="Home">
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout currentPageName="About">
              <AboutPage />
            </Layout>
          }
        />
        <Route
          path="/pujabooking"
          element={
            <Layout currentPageName="PujaBooking">
              <PujaBookingPage />
            </Layout>
          }
        />
        <Route
          path="/priestbooking"
          element={
            <Layout currentPageName="PriestBooking">
              <PriestBookingPage />
            </Layout>
          }
        />
        <Route
          path="/donations"
          element={
            <Layout currentPageName="Donations">
              <DonationsPage />
            </Layout>
          }
        />
        <Route
          path="/eventsgalleries"
          element={
            <Layout currentPageName="EventsGalleries">
              <EventsGalleriesPage />
            </Layout>
          }
        />
        <Route
          path="/volunteer"
          element={
            <Layout currentPageName="Volunteer">
              <VolunteerPage />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout currentPageName="Contact">
              <ContactPage />
            </Layout>
          }
        />
        <Route
          path="/hero-image-management"
          element={
            <Layout currentPageName="HeroImageManagement">
              <HeroImageManagement />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
