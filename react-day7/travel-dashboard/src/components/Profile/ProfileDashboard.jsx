import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { MapPin, DollarSign, Calendar, Plane, Loader } from "lucide-react";
import { supabase } from "../../lib/supabaseClient.js";
import "../../styles/dashboard.css";

const ProfileDashboard = () => {
  const { user } = useUser();

  const [userData] = useState({
    fullName: user?.user_metadata?.full_name || "User",
    email: user?.email || "",
    username: user?.user_metadata?.username || "username",
    location: user?.user_metadata?.location || "Not set",
    avatar:
      user?.user_metadata?.avatar_url ||
      "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
    joinDate: user?.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : "Not set",
  });

  const [trips, setTrips] = useState([]);
  const [items, setItems] = useState([]);
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
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (tripsError) throw tripsError;
        setTrips(tripsData || []);

        // Fetch items (expenses/places)
        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (itemsError) throw itemsError;
        setItems(itemsData || []);
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

    // Subscribe to items changes
    const itemsSubscription = supabase
      .channel("items_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "items",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setItems((prev) => prev.filter((i) => i.id !== payload.old.id));
          } else if (payload.eventType === "INSERT") {
            setItems((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setItems((prev) =>
              prev.map((i) => (i.id === payload.new.id ? payload.new : i))
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(tripsSubscription);
      supabase.removeChannel(itemsSubscription);
    };
  }, [user?.id]);

  // Calculate stats
  const expenses = items.filter((item) => item.type === "expense");
  const places = items.filter((item) => item.type === "place");

  const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
  const totalPlacesVisited = places.length;

  const getStatusColor = (status) => {
    return status === "completed"
      ? "bg-green-100 text-green-800"
      : status === "ongoing"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800";
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
              const tripExpenses = expenses.filter(
                (e) => e.trip_id === trip.id
              );
              const tripSpent = tripExpenses.reduce(
                (sum, e) => sum + (e.amount || 0),
                0
              );
              const progress = trip.budget
                ? (tripSpent / trip.budget) * 100
                : 0;

              return (
                <div key={trip.id} className="profile-dashboard-trip-card">
                  <div className="profile-dashboard-trip-header">
                    <h3>{trip.name}</h3>
                    <span
                      className={`profile-dashboard-trip-status ${getStatusColor(
                        trip.status
                      )}`}
                    >
                      {trip.status?.charAt(0).toUpperCase() +
                        trip.status?.slice(1) || "Planned"}
                    </span>
                  </div>
                  <div className="profile-dashboard-trip-content">
                    <div className="profile-dashboard-trip-date">
                      <Calendar size={16} />
                      {trip.start_date
                        ? new Date(trip.start_date).toLocaleDateString()
                        : "TBD"}{" "}
                      -{" "}
                      {trip.end_date
                        ? new Date(trip.end_date).toLocaleDateString()
                        : "TBD"}
                    </div>
                    <div className="profile-dashboard-trip-budget">
                      <div className="profile-dashboard-budget-label">
                        <span>Budget vs Spent</span>
                        <span className="profile-dashboard-budget-amount">
                          ${tripSpent} / ${trip.budget || 0}
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
                {expenses.map((expense) => {
                  const tripName =
                    trips.find((t) => t.id === expense.trip_id)?.name ||
                    "Unknown";
                  return (
                    <tr key={expense.id}>
                      <td className="profile-dashboard-table-trip">
                        {tripName}
                      </td>
                      <td>{expense.category || "Other"}</td>
                      <td>
                        {expense.created_at
                          ? new Date(expense.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="profile-dashboard-table-amount">
                        ${expense.amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No expenses recorded yet.</p>
          )}
        </div>
      </div>

      {/* PLACES SECTION */}
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
          {places.length > 0 ? (
            places.map((place) => {
              const tripName =
                trips.find((t) => t.id === place.trip_id)?.name ||
                "Unknown Trip";
              return (
                <div key={place.id} className="profile-dashboard-place-card">
                  <div className="profile-dashboard-place-image" />
                  <div className="profile-dashboard-place-content">
                    <h3>{place.name}</h3>
                    <p className="profile-dashboard-place-country">
                      <MapPin size={14} />
                      {place.country || "Unknown"}
                    </p>
                    <div className="profile-dashboard-place-details">
                      <p>
                        <span className="profile-dashboard-place-label">
                          Trip:
                        </span>{" "}
                        {tripName}
                      </p>
                      <p>
                        <span className="profile-dashboard-place-label">
                          Date:
                        </span>{" "}
                        {place.created_at
                          ? new Date(place.created_at).toLocaleDateString()
                          : "N/A"}
                      </p>
                      {place.rating && (
                        <div className="profile-dashboard-place-rating">
                          <span className="profile-dashboard-place-label">
                            Rating:
                          </span>
                          <span className="profile-dashboard-stars">
                            {"★".repeat(place.rating)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No places visited yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
