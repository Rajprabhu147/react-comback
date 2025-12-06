// src/components/Calendar/LocationAutocomplete.jsx

import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapPin, X } from "lucide-react";
import {
  getLocationSuggestions,
  formatLocationString,
} from "../../services/locationService";
import "../../styles/location-autocomplete.css";

const LocationAutocomplete = ({
  value = "",
  onChange,
  placeholder = "Enter location...",
}) => {
  const [isOpen, setIsOpen] = useState(false); // controlled open state
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Compute suggestions synchronously from service (memoized)
  const suggestions = useMemo(() => {
    if (value && value.trim().length > 0) {
      try {
        const res = getLocationSuggestions(value);
        return Array.isArray(res) ? res : [];
      } catch (e) {
        console.error("Error getting location suggestions:", e);
        return [];
      }
    }
    return [];
  }, [value]);

  // Derived boolean — do NOT store this in state
  const showSuggestions =
    isOpen && value && value.trim().length > 0 && suggestions.length > 0;

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

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
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          selectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    const formattedLocation = formatLocationString(suggestion);
    // Keep onChange signature compatible with both direct values and event-like object
    if (typeof onChange === "function") {
      onChange({
        target: {
          name: "location",
          value: formattedLocation,
        },
      });
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const clearInput = () => {
    if (typeof onChange === "function") {
      onChange({
        target: {
          name: "location",
          value: "",
        },
      });
    }
    inputRef.current?.focus();
    setIsOpen(false);
    setHighlightedIndex(-1);
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
          onChange={(e) => {
            if (typeof onChange === "function") onChange(e);
            // open suggestions on typing if suggestions exist
            if (e.target.value && e.target.value.trim().length > 0) {
              setIsOpen(true);
            } else {
              setIsOpen(false);
            }
          }}
          onFocus={() => {
            if (value && value.trim().length > 0 && suggestions.length > 0) {
              setIsOpen(true);
            } else {
              setIsOpen(true); // allow open so user can type and get suggestions
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="location-input"
          autoComplete="off"
        />
        {value && (
          <button
            onClick={clearInput}
            className="location-clear-btn"
            title="Clear"
            type="button"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="location-suggestions-dropdown"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => {
            const key =
              suggestion.id ??
              `${suggestion.name || ""}-${suggestion.city || ""}-${index}`;
            return (
              <div
                key={key}
                role="option"
                aria-selected={index === highlightedIndex}
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
            );
          })}
        </div>
      )}

      {isOpen && value && suggestions.length === 0 && (
        <div className="location-no-results">
          <p>No locations found for "{value}"</p>
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
