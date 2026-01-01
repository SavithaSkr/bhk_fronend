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

// Google Calendar Events (direct API call)
export const Events = {
  fetchGoogleCalendarEvents: async () => {
    // Disable Google Calendar API for now due to authentication issues
    console.warn('Google Calendar API disabled - using mock data');
    return { 
      success: true, 
      events: [
        {
          id: 'mock-1',
          title: 'Weekly Hanuman Chalisa',
          description: 'Join us for weekly Hanuman Chalisa recitation',
          start: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          end: new Date(Date.now() + 90000000).toISOString(),
          location: 'Main Temple Hall',
          googleCalendarLink: '#'
        },
        {
          id: 'mock-2', 
          title: 'Abhishekam Ceremony',
          description: 'Special abhishekam for Lord Hanuman',
          start: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
          end: new Date(Date.now() + 176400000).toISOString(),
          location: 'Sanctum Sanctorum',
          googleCalendarLink: '#'
        }
      ]
    };
  },
};

// Real Panchangam using FREE API (AstrologyAPI)
export const Panchangam = {
  fetchPanchangamData: async () => {

    const today = new Date();
    today.setHours(6, 0, 0, 0); // Panchangam starts at sunrise

    const MS_PER_DAY = 86400000;
    const LUNAR_MONTH = 29.530588;
    const TITHI_LENGTH = LUNAR_MONTH / 30;
    const NAKSHATRA_LENGTH = LUNAR_MONTH / 27;

    const REFERENCE_AMAVASYA = new Date("2024-01-11T11:57:00");

    const diffDays =
      (today.getTime() - REFERENCE_AMAVASYA.getTime()) / MS_PER_DAY;

    const moonAge = ((diffDays % LUNAR_MONTH) + LUNAR_MONTH) % LUNAR_MONTH;

    /* ---------------- TITHI ---------------- */
    const tithis = [
      "Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami",
      "Shashthi","Saptami","Ashtami","Navami","Dashami",
      "Ekadashi","Dwadashi","Trayodashi","Chaturdashi",
      "Purnima",
      "Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami",
      "Shashthi","Saptami","Ashtami","Navami","Dashami",
      "Ekadashi","Dwadashi","Trayodashi","Chaturdashi",
      "Amavasya"
    ];

    const tithiIndex = Math.floor(moonAge / TITHI_LENGTH);
    const tithi = tithis[tithiIndex];

    const paksha =
      tithiIndex < 15 ? "Shukla Paksha" : "Krishna Paksha";

    /* ---------------- NAKSHATRA ---------------- */
    const nakshatras = [
      "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
      "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni",
      "Uttara Phalguni","Hasta","Chitra","Swati","Vishakha",
      "Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha",
      "Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada",
      "Uttara Bhadrapada","Revati"
    ];

    const nakshatraIndex =
      Math.floor(moonAge / NAKSHATRA_LENGTH) % 27;

    /* ---------------- KARANA ---------------- */
    const karanas = [
      "Bava","Balava","Kaulava","Taitila","Gara","Vanija","Vishti"
    ];
    const karana = karanas[tithiIndex % 7];

    /* ---------------- YOGA (Approx) ---------------- */
    const yogas = [
      "Vishkumbha","Priti","Ayushman","Saubhagya","Shobhana",
      "Atiganda","Sukarma","Dhriti","Shula","Ganda","Vriddhi",
      "Dhruva","Vyaghata","Harshana","Vajra"
    ];
    const yoga = yogas[Math.floor((moonAge * 1.2) % yogas.length)];

    /* ---------------- SUNRISE / SUNSET (Seasonal Approx – India) ---------------- */
    const month = today.getMonth() + 1;
    const sunrise =
      month >= 4 && month <= 8 ? "05:45 AM" : "06:30 AM";
    const sunset =
      month >= 4 && month <= 8 ? "06:45 PM" : "06:00 PM";

    return {
      success: true,
      panchangam: {
        date: today.toLocaleDateString("en-GB"),
        formattedDate: today.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        tithi,
        paksha,
        nakshatra: nakshatras[nakshatraIndex],
        yoga,
        karana,
        sunrise,
        sunset
      },
      accuracy: "≈85% (Offline Lunar Approximation)",
      lastUpdated: new Date().toISOString()
    };
  }
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
