import api from "./api";

// Generic CRUD functions for any entity
const createEntityService = (endpoint) => ({
  list: async (sortBy = "-created_date", limit) => {
    try {
      const response = await api.get(`/${endpoint}`, {
        params: { sortBy, limit },
      });
      return response.data;
    } catch (error) {
      console.error(`Error listing ${endpoint}:`, error);
      throw error;
    }
  },
  filter: async (filters = {}, sortBy = "-created_date", limit) => {
    try {
      const response = await api.get(`/${endpoint}`, {
        params: { ...filters, sortBy, limit },
      });
      return response.data;
    } catch (error) {
      console.error(`Error filtering ${endpoint}:`, error);
      throw error;
    }
  },
  get: async (id) => {
    try {
      const response = await api.get(`/${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${endpoint} with ID ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post(`/${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error creating ${endpoint}:`, error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/${endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating ${endpoint} with ID ${id}:`, error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ${endpoint} with ID ${id}:`, error);
      throw error;
    }
  },
});

// Specific entity services
export const HeroImage = createEntityService("hero-images");
export const GoogleDriveImage = createEntityService("google-drive-images");
export const VideoGalleryItem = createEntityService("video-gallery");
export const Donation = createEntityService("donations");
export const DonationCart = createEntityService("donation-cart");
export const ContactInquiry = createEntityService("contact-inquiries");

// Google Calendar Events (direct API call from frontend's perspective, but proxied via backend)
export const Events = {
  fetchGoogleCalendarEvents: async () => {
    try {
      const response = await api.get("/events");
      return response.data;
    } catch (error) {
      console.error("Error fetching Google Calendar events:", error);
      // Return a structured error response for the frontend to handle
      return { success: false, events: [], error: error.message };
    }
  },
};

// Panchangam (direct API call from frontend's perspective, but proxied via backend)
export const Panchangam = {
  fetchPanchangamData: async () => {
    try {
      const response = await api.get("/panchangam");
      return response.data;
    } catch (error) {
      console.error("Error fetching Panchangam data:", error);
      return {
        success: false,
        panchangam: null,
        auspiciousDays: [],
        error: error.message,
      };
    }
  },
};

// Placeholder for User entity methods
export const User = {
  // In a local environment without authentication, we can mock user data
  me: async () => {
    return {
      id: "mock-user-id",
      full_name: "Local User",
      email: "local@example.com",
      role: "admin", // Assume admin for full functionality locally
    };
  },
  // Other methods would be implemented if authentication was added
};
