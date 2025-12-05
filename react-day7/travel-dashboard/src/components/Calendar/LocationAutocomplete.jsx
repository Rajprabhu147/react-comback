// components/LocationAutocomplete.jsx

import React, { useState, useEffect, useRef } from "react";
import { MapPin, X } from "lucide-react";
import {
  getLocationSuggestions,
  formatLocationString,
} from "../services/locationService";
import "../../styles/location-autocomplete.css";

const LocationAutocomplete = ({
  value,
  onChange,
  placeholder = "Enter location...",
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Get suggestions as user types
  useEffect(() => {
    if (value && value.trim().length > 0) {
      const newSuggestions = getLocationSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          selectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    const formattedLocation = formatLocationString(suggestion);
    onChange({
      target: {
        name: "location",
        value: formattedLocation,
      },
    });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const clearInput = () => {
    onChange({
      target: {
        name: "location",
        value: "",
      },
    });
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="location-autocomplete-wrapper">
      <div className="location-input-container">
        <MapPin size={18} className="location-input-icon" />
        <input
          ref={inputRef}
          type="text"
          name="location"
          value={value}
          onChange={(e) => onChange(e)}
          onFocus={() =>
            value && suggestions.length > 0 && setShowSuggestions(true)
          }
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="location-input"
        />
        {value && (
          <button
            onClick={clearInput}
            className="location-clear-btn"
            title="Clear"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="location-suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.name}-${suggestion.city}`}
              className={`location-suggestion-item ${
                index === highlightedIndex ? "highlighted" : ""
              }`}
              onClick={() => selectSuggestion(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="suggestion-icon">
                <MapPin size={14} />
              </div>
              <div className="suggestion-content">
                <div className="suggestion-name">{suggestion.name}</div>
                <div className="suggestion-details">
                  {suggestion.city}, {suggestion.country}
                </div>
              </div>
              <div className="suggestion-category">{suggestion.category}</div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && value && suggestions.length === 0 && (
        <div className="location-no-results">
          <p>No locations found for "{value}"</p>
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
