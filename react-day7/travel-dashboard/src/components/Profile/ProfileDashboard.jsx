import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { MapPin, DollarSign, Calendar, Plane, Loader } from "lucide-react";
import { supabase } from "../../lib/supabaseClient.js";
import "../../styles/dashboard.css";

const ProfileDashboard = () => {
  const { user } = useUser();

  const [userData, setUserData] = useState({
    fullName: user?.user_metadata?.full_name || "User",
    email: user?.email || "",
    username: user?.user_metadata?.username || "username",
    location: user?.user_metadata?.location || "Not set",
    avatar:
      user?.user_metadata?.avatar_url ||
      "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
    joinDate: "2024-01-15",
  });

  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch trips
        const { data: tripsData, error: tripsError } = await supabase
          .from("trips")
          .select("*")
          .eq("user_id", user.id);

        if (tripsError) throw tripsError;
        setTrips(tripsData || []);

        // Fetch expenses
        const { data: expensesData, error: expensesError } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false });

        if (expensesError) throw expensesError;
        setExpenses(expensesData || []);

        // Fetch visited places
        const { data: placesData, error: placesError } = await supabase
          .from("visited_places")
          .select("*")
          .eq("user_id", user.id);

        if (placesError) throw placesError;
        setVisitedPlaces(placesData || []);

        // Fetch itinerary
        const { data: itineraryData, error: itineraryError } = await supabase
          .from("itinerary")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: true });

        if (itineraryError) throw itineraryError;
        setItinerary(itineraryData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user?.id]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to trips changes
    const tripsSubscription = supabase
      .channel("trips_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trips",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setTrips((prev) => prev.filter((t) => t.id !== payload.old.id));
          } else if (payload.eventType === "INSERT") {
            setTrips((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setTrips((prev) =>
              prev.map((t) => (t.id === payload.new.id ? payload.new : t))
            );
          }
        }
      )
      .subscribe();

    // Subscribe to expenses changes
    const expensesSubscription = supabase
      .channel("expenses_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "expenses",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setExpenses((prev) => prev.filter((e) => e.id !== payload.old.id));
          } else if (payload.eventType === "INSERT") {
            setExpenses((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setExpenses((prev) =>
              prev.map((e) => (e.id === payload.new.id ? payload.new : e))
            );
          }
        }
      )
      .subscribe();

    // Subscribe to visited places changes
    const placesSubscription = supabase
      .channel("places_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "visited_places",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setVisitedPlaces((prev) =>
              prev.filter((p) => p.id !== payload.old.id)
            );
          } else if (payload.eventType === "INSERT") {
            setVisitedPlaces((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setVisitedPlaces((prev) =>
              prev.map((p) => (p.id === payload.new.id ? payload.new : p))
            );
          }
        }
      )
      .subscribe();

    // Subscribe to itinerary changes
    const itinerarySubscription = supabase
      .channel("itinerary_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "itinerary",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setItinerary((prev) => prev.filter((i) => i.id !== payload.old.id));
          } else if (payload.eventType === "INSERT") {
            setItinerary((prev) =>
              [payload.new, ...prev].sort(
                (a, b) => new Date(a.date) - new Date(b.date)
              )
            );
          } else if (payload.eventType === "UPDATE") {
            setItinerary((prev) =>
              prev.map((i) => (i.id === payload.new.id ? payload.new : i))
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(tripsSubscription);
      supabase.removeChannel(expensesSubscription);
      supabase.removeChannel(placesSubscription);
      supabase.removeChannel(itinerarySubscription);
    };
  }, [user?.id]);

  const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
  const totalPlacesVisited = visitedPlaces.length;

  const getStatusColor = (status) => {
    return status === "completed"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";
  };

  if (loading) {
    return (
      <div
        className="profile-dashboard-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Loader size={32} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-dashboard-container" style={{ padding: "2rem" }}>
        <div style={{ color: "red", textAlign: "center" }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

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
          {trips.length > 0 ? (
            trips.map((trip) => {
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
                      {trip.status.charAt(0).toUpperCase() +
                        trip.status.slice(1)}
                    </span>
                  </div>
                  <div className="profile-dashboard-trip-content">
                    <div className="profile-dashboard-trip-date">
                      <Calendar size={16} />
                      {new Date(trip.start_date).toLocaleDateString()} -{" "}
                      {new Date(trip.end_date).toLocaleDateString()}
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
            })
          ) : (
            <p>No trips yet. Start planning your next adventure!</p>
          )}
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
          {expenses.length > 0 ? (
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
                      {expense.trip_name}
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
          ) : (
            <p>No expenses recorded yet.</p>
          )}
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
          {itinerary.length > 0 ? (
            itinerary.map((item, idx) => (
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
                      {item.trip_name}
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
            ))
          ) : (
            <p>No itinerary planned yet.</p>
          )}
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
          {visitedPlaces.length > 0 ? (
            visitedPlaces.map((place) => (
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
                      <span className="profile-dashboard-place-label">
                        Trip:
                      </span>{" "}
                      {place.trip_name}
                    </p>
                    <p>
                      <span className="profile-dashboard-place-label">
                        Date:
                      </span>{" "}
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
            ))
          ) : (
            <p>No places visited yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
