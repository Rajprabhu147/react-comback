// components/ItineraryMap.jsx

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Maximize2, Navigation } from "lucide-react";
import {
  getActivitiesCoordinates,
  calculateBounds,
} from "../services/locationCoordinatesService";
import "../../styles/itinerary-map.css";

const ItineraryMap = ({ activities }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Get coordinates for all activities
  const activitiesWithCoords = getActivitiesCoordinates(activities);

  useEffect(() => {
    // Load Leaflet library dynamically
    if (!window.L) {
      const leafletCss = document.createElement("link");
      leafletCss.rel = "stylesheet";
      leafletCss.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(leafletCss);

      const leafletScript = document.createElement("script");
      leafletScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      leafletScript.async = true;
      leafletScript.onload = initializeMap;
      document.body.appendChild(leafletScript);
    } else {
      initializeMap();
    }
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;

    const L = window.L;

    // Initialize map with default center
    map.current = L.map(mapContainer.current).setView([20, 0], 2);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.current);

    setIsLoaded(true);
  };

  // Update markers when activities change
  useEffect(() => {
    if (!isLoaded || !map.current || activitiesWithCoords.length === 0) return;

    const L = window.L;

    // Clear existing markers and layers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.current.removeLayer(layer);
      }
    });

    // Create custom icon for markers
    const createIcon = (dayNumber, isFirst, isLast) => {
      let color = "#05668d";
      let iconClass = "";

      if (isFirst) {
        color = "#10b981";
        iconClass = "start-marker";
      } else if (isLast) {
        color = "#ef4444";
        iconClass = "end-marker";
      }

      return L.divIcon({
        className: `custom-marker ${iconClass}`,
        html: `<div class="marker-content" style="background-color: ${color};">${dayNumber}</div>`,
        iconSize: [40, 40],
        className: "",
      });
    };

    // Add markers for each activity
    activitiesWithCoords.forEach((activity, index) => {
      const isFirst = index === 0;
      const isLast = index === activitiesWithCoords.length - 1;
      const icon = createIcon(activity.day, isFirst, isLast);

      const marker = L.marker(
        [activity.coordinates.lat, activity.coordinates.lng],
        {
          icon: icon,
        }
      ).addTo(map.current);

      const popupContent = `
        <div class="map-popup">
          <div class="popup-header">
            <span class="popup-day">Day ${activity.day}</span>
            <span class="popup-time">${activity.time}</span>
          </div>
          <div class="popup-activity">${activity.activity}</div>
          <div class="popup-location">
            <MapPin size={12} /> ${activity.location}
          </div>
          ${
            activity.budget
              ? `<div class="popup-budget">💵 $${activity.budget}</div>`
              : ""
          }
          ${
            activity.notes
              ? `<div class="popup-notes">${activity.notes}</div>`
              : ""
          }
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => setSelectedMarker(activity.id));
    });

    // Draw polyline connecting all markers
    if (activitiesWithCoords.length > 1) {
      const polylinePoints = activitiesWithCoords.map((activity) => [
        activity.coordinates.lat,
        activity.coordinates.lng,
      ]);

      const polyline = L.polyline(polylinePoints, {
        color: "#0ea5e9",
        weight: 3,
        opacity: 0.7,
        dashArray: "5, 5",
      }).addTo(map.current);
    }

    // Fit map to bounds
    const bounds = calculateBounds(
      activitiesWithCoords.map((a) => a.coordinates)
    );
    if (bounds) {
      const L = window.L;
      const mapBounds = L.latLngBounds(
        [bounds.bounds.minLat, bounds.bounds.minLng],
        [bounds.bounds.maxLat, bounds.bounds.maxLng]
      );
      map.current.fitBounds(mapBounds, { padding: [50, 50] });
    }
  }, [isLoaded, activitiesWithCoords]);

  const handleFullscreen = () => {
    if (mapContainer.current) {
      if (mapContainer.current.requestFullscreen) {
        mapContainer.current.requestFullscreen();
      } else if (mapContainer.current.webkitRequestFullscreen) {
        mapContainer.current.webkitRequestFullscreen();
      }
    }
  };

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const handleCenterRoute = () => {
    if (!map.current || activitiesWithCoords.length === 0) return;
    const bounds = calculateBounds(
      activitiesWithCoords.map((a) => a.coordinates)
    );
    if (bounds) {
      const L = window.L;
      const mapBounds = L.latLngBounds(
        [bounds.bounds.minLat, bounds.bounds.minLng],
        [bounds.bounds.maxLat, bounds.bounds.maxLng]
      );
      map.current.fitBounds(mapBounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="itinerary-map-container">
      <div className="map-header">
        <div className="map-title">
          <MapPin size={20} />
          <h3>Trip Route Map</h3>
          <span className="location-count">
            {activitiesWithCoords.length} locations
          </span>
        </div>
        <div className="map-controls">
          <button
            className="map-control-btn"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            +
          </button>
          <button
            className="map-control-btn"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            −
          </button>
          <button
            className="map-control-btn"
            onClick={handleCenterRoute}
            title="Center Route"
          >
            <Navigation size={16} />
          </button>
          <button
            className="map-control-btn"
            onClick={handleFullscreen}
            title="Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      <div ref={mapContainer} className="map-container" />

      {activitiesWithCoords.length === 0 && (
        <div className="map-empty-state">
          <div className="empty-icon">🗺️</div>
          <p>No activities with locations to display on the map</p>
        </div>
      )}

      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-marker start">1</span>
          <span>Start Point</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker mid">2</span>
          <span>Waypoint</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker end">3</span>
          <span>End Point</span>
        </div>
        <div className="legend-item">
          <span className="legend-line"></span>
          <span>Route Path</span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryMap;
