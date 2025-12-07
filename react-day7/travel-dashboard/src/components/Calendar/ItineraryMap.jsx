// src/components/Calendar/ItineraryMap.jsx

import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Maximize2, Navigation } from "lucide-react";
import {
  getActivitiesCoordinates,
  calculateBounds,
} from "../../services/locationCoordinatesService";
import "../../styles/itinerary-map.css";

const ItineraryMap = ({ activities = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const initializeMapRef = useRef(null);

  // Get coordinates for all activities
  const activitiesWithCoords = getActivitiesCoordinates(activities);

  // Initialize map - moved before useEffect that calls it
  const initializeMap = useCallback(() => {
    if (!mapContainer.current || map.current) return;

    try {
      const L = window.L;
      if (!L) {
        console.error("Leaflet not available");
        return;
      }

      // Ensure container has dimensions
      if (mapContainer.current.offsetHeight === 0) {
        console.warn("Map container has no height");
        // Try again after a delay
        if (initializeMapRef.current) {
          setTimeout(() => initializeMapRef.current?.(), 500);
        }
        return;
      }

      // Initialize map with default center
      map.current = L.map(mapContainer.current, {
        zoomControl: false,
      }).setView([20, 0], 2);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map.current);

      setIsLoaded(true);
      setMapReady(true);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, []);

  // Set ref so recursive call works
  useEffect(() => {
    initializeMapRef.current = initializeMap;
  }, [initializeMap]);

  // Load Leaflet library
  useEffect(() => {
    if (map.current) return; // Already initialized

    if (!window.L) {
      // Load CSS
      const leafletCss = document.createElement("link");
      leafletCss.rel = "stylesheet";
      leafletCss.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(leafletCss);

      // Load JS
      const leafletScript = document.createElement("script");
      leafletScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      leafletScript.async = true;
      leafletScript.onload = () => {
        // Wait for DOM to be ready
        setTimeout(() => {
          initializeMap();
        }, 100);
      };
      leafletScript.onerror = () => {
        console.error("Failed to load Leaflet");
      };
      document.body.appendChild(leafletScript);
    } else {
      // Leaflet already loaded
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
  }, [initializeMap]);

  // Update markers when activities change
  useEffect(() => {
    if (!isLoaded || !map.current || !mapReady) return;

    try {
      const L = window.L;

      // Clear existing markers and layers
      map.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.current.removeLayer(layer);
        }
      });

      // If no activities with coordinates, show default view
      if (activitiesWithCoords.length === 0) {
        map.current.setView([20, 0], 2);
        return;
      }

      // Create custom icon for markers
      const createIcon = (dayNumber, isFirst, isLast) => {
        let color = "#05668d";

        if (isFirst) {
          color = "#10b981";
        } else if (isLast) {
          color = "#ef4444";
        }

        return L.divIcon({
          className: `custom-marker`,
          html: `<div class="marker-content" style="background-color: ${color};">${dayNumber}</div>`,
          iconSize: [40, 40],
        });
      };

      // Add markers for each activity
      activitiesWithCoords.forEach((activity, index) => {
        try {
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
              <div class="popup-location">📍 ${activity.location}</div>
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
        } catch (error) {
          console.error("Error adding marker:", error);
        }
      });

      // Draw polyline connecting all markers
      if (activitiesWithCoords.length > 1) {
        try {
          const polylinePoints = activitiesWithCoords.map((activity) => [
            activity.coordinates.lat,
            activity.coordinates.lng,
          ]);

          L.polyline(polylinePoints, {
            color: "#0ea5e9",
            weight: 3,
            opacity: 0.7,
            dashArray: "5, 5",
          }).addTo(map.current);
        } catch (error) {
          console.error("Error adding polyline:", error);
        }
      }

      // Fit map to bounds with proper validation
      try {
        const bounds = calculateBounds(
          activitiesWithCoords.map((a) => a.coordinates)
        );

        if (bounds && bounds.bounds) {
          const mapBounds = L.latLngBounds(
            [bounds.bounds.minLat, bounds.bounds.minLng],
            [bounds.bounds.maxLat, bounds.bounds.maxLng]
          );

          // Validate bounds before fitting
          if (mapBounds.isValid && mapBounds.isValid()) {
            map.current.fitBounds(mapBounds, { padding: [50, 50] });
          } else {
            // If bounds are invalid, center on first activity
            if (activitiesWithCoords.length > 0) {
              map.current.setView(
                [
                  activitiesWithCoords[0].coordinates.lat,
                  activitiesWithCoords[0].coordinates.lng,
                ],
                10
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fitting bounds:", error);
        // Fallback: center on first activity
        if (activitiesWithCoords.length > 0) {
          try {
            map.current.setView(
              [
                activitiesWithCoords[0].coordinates.lat,
                activitiesWithCoords[0].coordinates.lng,
              ],
              10
            );
          } catch (e) {
            console.error("Error setting view:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error updating map:", error);
    }
  }, [isLoaded, activitiesWithCoords, mapReady]);

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

    try {
      const bounds = calculateBounds(
        activitiesWithCoords.map((a) => a.coordinates)
      );

      if (bounds && bounds.bounds) {
        const L = window.L;
        const mapBounds = L.latLngBounds(
          [bounds.bounds.minLat, bounds.bounds.minLng],
          [bounds.bounds.maxLat, bounds.bounds.maxLng]
        );

        if (mapBounds.isValid && mapBounds.isValid()) {
          map.current.fitBounds(mapBounds, { padding: [50, 50] });
        } else {
          map.current.setView(
            [
              activitiesWithCoords[0].coordinates.lat,
              activitiesWithCoords[0].coordinates.lng,
            ],
            10
          );
        }
      }
    } catch (error) {
      console.error("Error centering route:", error);
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

      <div className="map-wrapper">
        <div ref={mapContainer} className="map-container" />

        {activitiesWithCoords.length === 0 && (
          <div className="map-empty-state">
            <div className="empty-icon">🗺️</div>
            <p>No activities with recognized locations to display on the map</p>
            <p className="empty-hint">
              Add activities with location names from the database (e.g.,
              "Eiffel Tower", "Big Ben")
            </p>
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
    </div>
  );
};

export default ItineraryMap;
