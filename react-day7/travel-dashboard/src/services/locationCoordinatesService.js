// services/locationCoordinatesService.js

/**
 * Location coordinates database for popular travel destinations
 * Maps location names to latitude and longitude
 */

const LOCATION_COORDINATES = {
  // Paris
  "Eiffel Tower": { lat: 48.8584, lng: 2.2945, city: "Paris" },
  "Louvre Museum": { lat: 48.8606, lng: 2.3352, city: "Paris" },
  "Arc de Triomphe": { lat: 48.8738, lng: 2.295, city: "Paris" },
  "Notre-Dame Cathedral": { lat: 48.853, lng: 2.3499, city: "Paris" },
  "Sacré-Cœur": { lat: 48.8867, lng: 2.3431, city: "Paris" },
  "Latin Quarter": { lat: 48.8506, lng: 2.3488, city: "Paris" },
  "Champs-Élysées": { lat: 48.8698, lng: 2.3077, city: "Paris" },

  // London
  "Big Ben": { lat: 51.4975, lng: -0.1247, city: "London" },
  "Tower of London": { lat: 51.5055, lng: -0.0754, city: "London" },
  "British Museum": { lat: 51.5194, lng: -0.1269, city: "London" },
  "Buckingham Palace": { lat: 51.5007, lng: -0.1415, city: "London" },
  "Westminster Abbey": { lat: 51.4953, lng: -0.1272, city: "London" },

  // Tokyo
  "Senso-ji Temple": { lat: 35.7148, lng: 139.7967, city: "Tokyo" },
  "Shibuya Crossing": { lat: 35.6595, lng: 139.7004, city: "Tokyo" },
  "Tokyo Tower": { lat: 35.6586, lng: 139.7454, city: "Tokyo" },
  "Meiji Shrine": { lat: 35.6764, lng: 139.7011, city: "Tokyo" },
  "Tsukiji Market": { lat: 35.6655, lng: 139.7714, city: "Tokyo" },

  // New York
  "Statue of Liberty": { lat: 40.6892, lng: -74.0445, city: "New York" },
  "Times Square": { lat: 40.758, lng: -73.9855, city: "New York" },
  "Central Park": { lat: 40.7829, lng: -73.9654, city: "New York" },
  "Metropolitan Museum": { lat: 40.7813, lng: -73.974, city: "New York" },
  "Empire State Building": { lat: 40.7484, lng: -73.9857, city: "New York" },

  // Rome
  Colosseum: { lat: 41.8902, lng: 12.4924, city: "Rome" },
  "Roman Forum": { lat: 41.8925, lng: 12.4855, city: "Rome" },
  "Vatican City": { lat: 41.9029, lng: 12.4534, city: "Rome" },
  "Trevi Fountain": { lat: 41.9009, lng: 12.4833, city: "Rome" },
  Pantheon: { lat: 41.8986, lng: 12.4769, city: "Rome" },

  // Barcelona
  "Sagrada Familia": { lat: 41.4036, lng: 2.1744, city: "Barcelona" },
  "Park Güell": { lat: 41.4145, lng: 2.1527, city: "Barcelona" },
  "Gothic Quarter": { lat: 41.3844, lng: 2.1762, city: "Barcelona" },
  "La Rambla": { lat: 41.3815, lng: 2.1685, city: "Barcelona" },

  // Amsterdam
  "Anne Frank House": { lat: 52.3756, lng: 4.884, city: "Amsterdam" },
  "Van Gogh Museum": { lat: 52.3584, lng: 4.8811, city: "Amsterdam" },
  "Canal Cruise": { lat: 52.3676, lng: 4.9041, city: "Amsterdam" },
  "Dam Square": { lat: 52.374, lng: 4.8896, city: "Amsterdam" },

  // Sydney
  "Sydney Opera House": { lat: -33.8568, lng: 151.2153, city: "Sydney" },
  "Harbour Bridge": { lat: -33.8523, lng: 151.2108, city: "Sydney" },
  "Bondi Beach": { lat: -33.8892, lng: 151.2738, city: "Sydney" },
  "Royal Botanic Garden": { lat: -33.8621, lng: 151.2174, city: "Sydney" },

  // Dubai
  "Burj Khalifa": { lat: 25.1972, lng: 55.2744, city: "Dubai" },
  "Palm Jumeirah": { lat: 25.1124, lng: 55.1415, city: "Dubai" },
  "Dubai Mall": { lat: 25.1955, lng: 55.2708, city: "Dubai" },
  "Gold Souk": { lat: 25.2653, lng: 55.3097, city: "Dubai" },
};

export const getCoordinates = (locationName) => {
  if (!locationName) return null;

  // Try exact match first
  if (LOCATION_COORDINATES[locationName]) {
    return LOCATION_COORDINATES[locationName];
  }

  // Try partial match (for formatted strings like "Eiffel Tower, Paris, France")
  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (locationName.toLowerCase().includes(key.toLowerCase())) {
      return coords;
    }
  }

  return null;
};

export const getActivitiesCoordinates = (activities) => {
  return activities
    .map((activity) => {
      const coords = getCoordinates(activity.location);
      if (coords) {
        return {
          ...activity,
          coordinates: coords,
        };
      }
      return null;
    })
    .filter((item) => item !== null)
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
};

export const calculateBounds = (coordinates) => {
  if (coordinates.length === 0) return null;

  let minLat = coordinates[0].lat;
  let maxLat = coordinates[0].lat;
  let minLng = coordinates[0].lng;
  let maxLng = coordinates[0].lng;

  coordinates.forEach((coord) => {
    minLat = Math.min(minLat, coord.lat);
    maxLat = Math.max(maxLat, coord.lat);
    minLng = Math.min(minLng, coord.lng);
    maxLng = Math.max(maxLng, coord.lng);
  });

  return {
    center: {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    },
    bounds: {
      minLat,
      maxLat,
      minLng,
      maxLng,
    },
  };
};
