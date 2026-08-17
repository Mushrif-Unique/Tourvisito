import tokyoImage from "../assets/trips/tokyo.svg";
import dubaiImage from "../assets/trips/dubai.svg";
import romeImage from "../assets/trips/rome.svg";

const destinationImages = {
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
  tokyo: tokyoImage,
  "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=85",
  barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=85",
  dubai: dubaiImage,
  rome: romeImage,
  amsterdam: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=85",
  bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=85",
  sydney: "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?auto=format&fit=crop&w=1200&q=85",
};

export const genericTripImage =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85";

export const getTripFallbackImage = (trip = {}) => {
  const location = `${trip.destination || ""} ${trip.title || ""}`.toLowerCase();
  const matchedDestination = Object.keys(destinationImages).find((destination) =>
    location.includes(destination),
  );

  return matchedDestination ? destinationImages[matchedDestination] : genericTripImage;
};

export const getTripImage = (trip = {}) =>
  ["tokyo", "dubai", "rome"].some((destination) =>
    `${trip.destination || ""} ${trip.title || ""}`.toLowerCase().includes(destination),
  )
    ? getTripFallbackImage(trip)
    : typeof trip.image === "string" && trip.image.trim()
      ? trip.image.trim()
      : getTripFallbackImage(trip);
