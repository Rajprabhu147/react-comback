import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { MapPin, DollarSign, Calendar, Plane } from "lucide-react";
import "../../styles/dashboard.css";

const ProfileDashboard = () => {
  const { user } = useUser();

  // Mock data - Replace with API calls
  const [userData] = useState({
    fullName: user?.user_metadata?.full_name || "User",
    email: user?.email || "",
    username: user?.user_metadata?.username || "username",
    location: user?.user_metadata?.location || "Not set",
    avatar:
      user?.user_metadata?.avatar_url ||
      "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
    joinDate: "2024-01-15",
  });

  const [trips] = useState([
    {
      id: 1,
      name: "Tokyo Adventure",
      startDate: "2024-11-01",
      endDate: "2024-11-15",
      budget: 5000,
      spent: 4850,
      status: "completed",
    },
    {
      id: 2,
      name: "Europe Tour",
      startDate: "2025-05-01",
      endDate: "2025-05-30",
      budget: 8000,
      spent: 2100,
      status: "ongoing",
    },
  ]);

  const [expenses] = useState([
    {
      id: 1,
      trip: "Tokyo Adventure",
      category: "Accommodation",
      amount: 2500,
      date: "2024-11-01",
    },
    {
      id: 2,
      trip: "Tokyo Adventure",
      category: "Food",
      amount: 1200,
      date: "2024-11-05",
    },
    {
      id: 3,
      trip: "Tokyo Adventure",
      category: "Transport",
      amount: 800,
      date: "2024-11-08",
    },
    {
      id: 4,
      trip: "Europe Tour",
      category: "Accommodation",
      amount: 1500,
      date: "2025-05-01",
    },
  ]);

  const [visitedPlaces] = useState([
    {
      id: 1,
      name: "Tokyo Tower",
      country: "Japan",
      date: "2024-11-03",
      trip: "Tokyo Adventure",
      rating: 5,
    },
    {
      id: 2,
      name: "Senso-ji Temple",
      country: "Japan",
      date: "2024-11-05",
      trip: "Tokyo Adventure",
      rating: 4,
    },
    {
      id: 3,
      name: "Eiffel Tower",
      country: "France",
      date: "2025-05-10",
      trip: "Europe Tour",
      rating: 5,
    },
  ]);

  const [itinerary] = useState([
    {
      id: 1,
      trip: "Europe Tour",
      day: 1,
      activity: "Arrive in Paris",
      place: "Paris, France",
      date: "2025-05-01",
    },
    {
      id: 2,
      trip: "Europe Tour",
      day: 2,
      activity: "Visit Eiffel Tower",
      place: "Paris, France",
      date: "2025-05-02",
    },
    {
      id: 3,
      trip: "Europe Tour",
      day: 3,
      activity: "Travel to Amsterdam",
      place: "Amsterdam, Netherlands",
      date: "2025-05-03",
    },
  ]);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);
  const totalPlacesVisited = visitedPlaces.length;

  const getStatusColor = (status) => {
    return status === "completed"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";
  };

  return (
    <div className="profile-dashboard-container">
      {/* HEADER */}
      <div className="profile-dashboard-header">
        <div className="profile-dashboard-user-card">
          <img
            src={userData.avatar}
            alt={userData.fullName}
            className="profile-dashboard-avatar"
          />
          <div className="profile-dashboard-user-info">
            <h1 className="profile-dashboard-name">{userData.fullName}</h1>
            <p className="profile-dashboard-username">@{userData.username}</p>
            <div className="profile-dashboard-contact">
              <span>{userData.email}</span>
              <span className="profile-dashboard-dot">•</span>
              <span className="profile-dashboard-location">
                <MapPin size={16} />
                {userData.location}
              </span>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="profile-dashboard-stats">
          <div className="profile-dashboard-stat-card profile-dashboard-stat-blue">
            <p className="profile-dashboard-stat-label">Active Trips</p>
            <p className="profile-dashboard-stat-value">{trips.length}</p>
          </div>
          <div className="profile-dashboard-stat-card profile-dashboard-stat-green">
            <p className="profile-dashboard-stat-label">Total Spent</p>
            <p className="profile-dashboard-stat-value">
              ${totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="profile-dashboard-stat-card profile-dashboard-stat-purple">
            <p className="profile-dashboard-stat-label">Places Visited</p>
            <p className="profile-dashboard-stat-value">{totalPlacesVisited}</p>
          </div>
          <div className="profile-dashboard-stat-card profile-dashboard-stat-orange">
            <p className="profile-dashboard-stat-label">Total Budget</p>
            <p className="profile-dashboard-stat-value">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* TRIPS SECTION */}
      <div className="profile-dashboard-section">
        <div className="profile-dashboard-section-header">
          <div className="profile-dashboard-section-title">
            <Plane
              size={24}
              className="profile-dashboard-section-icon profile-dashboard-icon-blue"
            />
            <h2>Trips</h2>
          </div>
        </div>
        <div className="profile-dashboard-trips-grid">
          {trips.map((trip) => {
            const progress = (trip.spent / trip.budget) * 100;
            return (
              <div key={trip.id} className="profile-dashboard-trip-card">
                <div className="profile-dashboard-trip-header">
                  <h3>{trip.name}</h3>
                  <span
                    className={`profile-dashboard-trip-status ${getStatusColor(
                      trip.status
                    )}`}
                  >
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </span>
                </div>
                <div className="profile-dashboard-trip-content">
                  <div className="profile-dashboard-trip-date">
                    <Calendar size={16} />
                    {new Date(trip.startDate).toLocaleDateString()} -{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </div>
                  <div className="profile-dashboard-trip-budget">
                    <div className="profile-dashboard-budget-label">
                      <span>Budget vs Spent</span>
                      <span className="profile-dashboard-budget-amount">
                        ${trip.spent} / ${trip.budget}
                      </span>
                    </div>
                    <div className="profile-dashboard-progress-bar">
                      <div
                        className="profile-dashboard-progress-fill"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EXPENSES SECTION */}
      <div className="profile-dashboard-section">
        <div className="profile-dashboard-section-header">
          <div className="profile-dashboard-section-title">
            <DollarSign
              size={24}
              className="profile-dashboard-section-icon profile-dashboard-icon-green"
            />
            <h2>Recent Expenses</h2>
          </div>
        </div>
        <div className="profile-dashboard-expenses-table">
          <table>
            <thead>
              <tr>
                <th>Trip</th>
                <th>Category</th>
                <th>Date</th>
                <th className="profile-dashboard-table-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="profile-dashboard-table-trip">
                    {expense.trip}
                  </td>
                  <td>{expense.category}</td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="profile-dashboard-table-amount">
                    ${expense.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ITINERARY SECTION */}
      <div className="profile-dashboard-section">
        <div className="profile-dashboard-section-header">
          <div className="profile-dashboard-section-title">
            <Calendar
              size={24}
              className="profile-dashboard-section-icon profile-dashboard-icon-purple"
            />
            <h2>Upcoming Plan</h2>
          </div>
        </div>
        <div className="profile-dashboard-itinerary">
          {itinerary.map((item, idx) => (
            <div key={item.id} className="profile-dashboard-itinerary-item">
              <div className="profile-dashboard-itinerary-timeline">
                <div className="profile-dashboard-itinerary-day">
                  {item.day}
                </div>
                {idx !== itinerary.length - 1 && (
                  <div className="profile-dashboard-itinerary-line" />
                )}
              </div>
              <div className="profile-dashboard-itinerary-content">
                <div className="profile-dashboard-itinerary-header">
                  <h4>{item.activity}</h4>
                  <span className="profile-dashboard-itinerary-trip">
                    {item.trip}
                  </span>
                </div>
                <p className="profile-dashboard-itinerary-place">
                  <MapPin size={14} />
                  {item.place}
                </p>
                <p className="profile-dashboard-itinerary-date">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VISITED PLACES SECTION */}
      <div className="profile-dashboard-section">
        <div className="profile-dashboard-section-header">
          <div className="profile-dashboard-section-title">
            <MapPin
              size={24}
              className="profile-dashboard-section-icon profile-dashboard-icon-red"
            />
            <h2>Places Visited</h2>
          </div>
        </div>
        <div className="profile-dashboard-places-grid">
          {visitedPlaces.map((place) => (
            <div key={place.id} className="profile-dashboard-place-card">
              <div className="profile-dashboard-place-image" />
              <div className="profile-dashboard-place-content">
                <h3>{place.name}</h3>
                <p className="profile-dashboard-place-country">
                  <MapPin size={14} />
                  {place.country}
                </p>
                <div className="profile-dashboard-place-details">
                  <p>
                    <span className="profile-dashboard-place-label">Trip:</span>{" "}
                    {place.trip}
                  </p>
                  <p>
                    <span className="profile-dashboard-place-label">Date:</span>{" "}
                    {new Date(place.date).toLocaleDateString()}
                  </p>
                  <div className="profile-dashboard-place-rating">
                    <span className="profile-dashboard-place-label">
                      Rating:
                    </span>
                    <span className="profile-dashboard-stars">
                      {"★".repeat(place.rating)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
