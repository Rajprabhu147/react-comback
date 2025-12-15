import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { MapPin, DollarSign, Calendar, Plane } from "lucide-react";

const ProfileDashboard = () => {
  const { user } = useUser(); // Get user from context

  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      try {
        // Example API calls
        const tripsRes = await fetch(`/api/trips/${user.id}`);
        const expensesRes = await fetch(`/api/expenses/${user.id}`);
        const placesRes = await fetch(`/api/places/${user.id}`);
        const itineraryRes = await fetch(`/api/itinerary/${user.id}`);

        const tripsData = await tripsRes.json();
        const expensesData = await expensesRes.json();
        const placesData = await placesRes.json();
        const itineraryData = await itineraryRes.json();

        setTrips(tripsData);
        setExpenses(expensesData);
        setVisitedPlaces(placesData);
        setItinerary(itineraryData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  // Rest of the component code...
};

export default ProfileDashboard;
