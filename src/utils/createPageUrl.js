// A simple utility to create page URLs based on page name
export const createPageUrl = (pageName) => {
  switch (pageName) {
    case "Home":
      return "/";
    case "About":
      return "/about";
    case "PujaBooking":
      return "/pujabooking";
    case "PriestBooking":
      return "/priestbooking";
    case "Donations":
      return "/donations";
    case "EventsGalleries":
      return "/eventsgalleries";
    case "Volunteer":
      return "/volunteer";
    case "Contact":
      return "/contact";
    case "HeroImageManagement":
      return "/hero-image-management"; // For admin page
    default:
      return "/";
  }
};
