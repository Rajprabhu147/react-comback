// services/locationService.js

// Popular travel destinations database
const POPULAR_DESTINATIONS = [
  // Paris
  {
    name: "Eiffel Tower",
    city: "Paris",
    country: "France",
    category: "landmark",
  },
  {
    name: "Louvre Museum",
    city: "Paris",
    country: "France",
    category: "museum",
  },
  {
    name: "Arc de Triomphe",
    city: "Paris",
    country: "France",
    category: "landmark",
  },
  {
    name: "Notre-Dame Cathedral",
    city: "Paris",
    country: "France",
    category: "landmark",
  },
  {
    name: "Sacré-Cœur",
    city: "Paris",
    country: "France",
    category: "landmark",
  },
  {
    name: "Latin Quarter",
    city: "Paris",
    country: "France",
    category: "neighborhood",
  },
  {
    name: "Champs-Élysées",
    city: "Paris",
    country: "France",
    category: "shopping",
  },

  // London
  {
    name: "Big Ben",
    city: "London",
    country: "United Kingdom",
    category: "landmark",
  },
  {
    name: "Tower of London",
    city: "London",
    country: "United Kingdom",
    category: "landmark",
  },
  {
    name: "British Museum",
    city: "London",
    country: "United Kingdom",
    category: "museum",
  },
  {
    name: "Buckingham Palace",
    city: "London",
    country: "United Kingdom",
    category: "landmark",
  },
  {
    name: "Westminster Abbey",
    city: "London",
    country: "United Kingdom",
    category: "landmark",
  },

  // Tokyo
  {
    name: "Senso-ji Temple",
    city: "Tokyo",
    country: "Japan",
    category: "landmark",
  },
  {
    name: "Shibuya Crossing",
    city: "Tokyo",
    country: "Japan",
    category: "landmark",
  },
  {
    name: "Tokyo Tower",
    city: "Tokyo",
    country: "Japan",
    category: "landmark",
  },
  {
    name: "Meiji Shrine",
    city: "Tokyo",
    country: "Japan",
    category: "landmark",
  },
  {
    name: "Tsukiji Market",
    city: "Tokyo",
    country: "Japan",
    category: "market",
  },

  // New York
  {
    name: "Statue of Liberty",
    city: "New York",
    country: "United States",
    category: "landmark",
  },
  {
    name: "Times Square",
    city: "New York",
    country: "United States",
    category: "landmark",
  },
  {
    name: "Central Park",
    city: "New York",
    country: "United States",
    category: "park",
  },
  {
    name: "Metropolitan Museum",
    city: "New York",
    country: "United States",
    category: "museum",
  },
  {
    name: "Empire State Building",
    city: "New York",
    country: "United States",
    category: "landmark",
  },

  // Rome
  { name: "Colosseum", city: "Rome", country: "Italy", category: "landmark" },
  { name: "Roman Forum", city: "Rome", country: "Italy", category: "landmark" },
  {
    name: "Vatican City",
    city: "Rome",
    country: "Italy",
    category: "landmark",
  },
  {
    name: "Trevi Fountain",
    city: "Rome",
    country: "Italy",
    category: "landmark",
  },
  { name: "Pantheon", city: "Rome", country: "Italy", category: "landmark" },

  // Barcelona
  {
    name: "Sagrada Familia",
    city: "Barcelona",
    country: "Spain",
    category: "landmark",
  },
  { name: "Park Güell", city: "Barcelona", country: "Spain", category: "park" },
  {
    name: "Gothic Quarter",
    city: "Barcelona",
    country: "Spain",
    category: "neighborhood",
  },
  {
    name: "La Rambla",
    city: "Barcelona",
    country: "Spain",
    category: "street",
  },

  // Amsterdam
  {
    name: "Anne Frank House",
    city: "Amsterdam",
    country: "Netherlands",
    category: "museum",
  },
  {
    name: "Van Gogh Museum",
    city: "Amsterdam",
    country: "Netherlands",
    category: "museum",
  },
  {
    name: "Canal Cruise",
    city: "Amsterdam",
    country: "Netherlands",
    category: "activity",
  },
  {
    name: "Dam Square",
    city: "Amsterdam",
    country: "Netherlands",
    category: "landmark",
  },

  // Sydney
  {
    name: "Sydney Opera House",
    city: "Sydney",
    country: "Australia",
    category: "landmark",
  },
  {
    name: "Harbour Bridge",
    city: "Sydney",
    country: "Australia",
    category: "landmark",
  },
  {
    name: "Bondi Beach",
    city: "Sydney",
    country: "Australia",
    category: "beach",
  },
  {
    name: "Royal Botanic Garden",
    city: "Sydney",
    country: "Australia",
    category: "park",
  },

  // Dubai
  {
    name: "Burj Khalifa",
    city: "Dubai",
    country: "United Arab Emirates",
    category: "landmark",
  },
  {
    name: "Palm Jumeirah",
    city: "Dubai",
    country: "United Arab Emirates",
    category: "landmark",
  },
  {
    name: "Dubai Mall",
    city: "Dubai",
    country: "United Arab Emirates",
    category: "shopping",
  },
  {
    name: "Gold Souk",
    city: "Dubai",
    country: "United Arab Emirates",
    category: "market",
  },
];

export const getLocationSuggestions = (query) => {
  if (!query || query.trim().length === 0) return [];

  const searchQuery = query.toLowerCase().trim();

  const suggestions = POPULAR_DESTINATIONS.filter((loc) => {
    return (
      loc.name.toLowerCase().includes(searchQuery) ||
      loc.city.toLowerCase().includes(searchQuery) ||
      loc.country.toLowerCase().includes(searchQuery)
    );
  });

  // Remove duplicates and limit to 8 results
  const uniqueSuggestions = Array.from(
    new Map(
      suggestions.map((item) => [`${item.name}-${item.city}`, item])
    ).values()
  ).slice(0, 8);

  return uniqueSuggestions;
};

export const formatLocationString = (location) => {
  if (typeof location === "string") return location;
  if (location.name && location.city) {
    return `${location.name}, ${location.city}, ${location.country}`;
  }
  return "";
};
