import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

/**
 * Hook: useStatusStats
 * Returns count of items grouped by status
 */
export const useStatusStats = () => {
  return useQuery({
    queryKey: ["statusStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("travel_items")
        .select("status");

      if (error) throw error;

      // Count by status
      const stats = data.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(stats).map(([status, count]) => ({
        status,
        count,
      }));
    },
  });
};

/**
 * Hook: usePriorityStats
 * Returns count of items grouped by priority
 */
export const usePriorityStats = () => {
  return useQuery({
    queryKey: ["priorityStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("travel_items")
        .select("priority");

      if (error) throw error;

      // Count by priority
      const stats = data.reduce((acc, item) => {
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(stats).map(([priority, count]) => ({
        priority,
        count,
      }));
    },
  });
};

/**
 * Hook: useEventsTimeSeries
 * Returns event counts for the last 7 days
 */
export const useEventsTimeSeries = () => {
  return useQuery({
    queryKey: ["eventsTimeSeries"],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("activity_log")
        .select("created_at")
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by day
      const eventsByDay = data.reduce((acc, event) => {
        const day = new Date(event.created_at).toISOString().split("T")[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});

      // Fill in missing days with 0
      const result = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.toISOString().split("T")[0];
        result.push({
          day,
          event_count: eventsByDay[day] || 0,
        });
      }

      return result;
    },
  });
};

/**
 * Hook: useActivityHeatmap
 * Returns activity count for each day in the last 6 months
 * Format: { date: "YYYY-MM-DD", count: number }
 */
export const useActivityHeatmap = () => {
  return useQuery({
    queryKey: ["activityHeatmap"],
    queryFn: async () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data, error } = await supabase
        .from("activity_log")
        .select("created_at")
        .gte("created_at", sixMonthsAgo.toISOString());

      if (error) throw error;

      // Group by date
      const activityByDate = data.reduce((acc, event) => {
        const date = new Date(event.created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Convert to array format for calendar heatmap
      return Object.entries(activityByDate).map(([date, count]) => ({
        date,
        count,
      }));
    },
  });
};

/**
 * Hook: useLocationStats
 * Returns locations with their coordinates and trip counts
 * Format: { name: string, latitude: number, longitude: number, count: number }
 */
export const useLocationStats = () => {
  return useQuery({
    queryKey: ["locationStats"],
    queryFn: async () => {
      // Assuming you have a trips table with location data
      const { data, error } = await supabase
        .from("trips")
        .select("destination, latitude, longitude");

      if (error) throw error;

      // Group by destination and count
      const locationCounts = data.reduce((acc, trip) => {
        const key = trip.destination;
        if (!acc[key]) {
          acc[key] = {
            name: trip.destination,
            latitude: trip.latitude,
            longitude: trip.longitude,
            count: 0,
          };
        }
        acc[key].count += 1;
        return acc;
      }, {});

      return Object.values(locationCounts);
    },
    // Return empty array if no trips table exists
    onError: () => [],
  });
};

/**
 * ALTERNATIVE: Mock data for testing (if you don't have real data yet)
 * Uncomment these and comment out the real implementations above
 */

/*
export const useActivityHeatmap = () => {
  return useQuery({
    queryKey: ["activityHeatmap"],
    queryFn: async () => {
      // Generate mock data for last 6 months
      const data = [];
      const today = new Date();
      
      for (let i = 180; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        
        // Random activity count (0-10)
        const count = Math.floor(Math.random() * 11);
        
        if (count > 0) {
          data.push({ date: dateStr, count });
        }
      }
      
      return data;
    },
  });
};

export const useLocationStats = () => {
  return useQuery({
    queryKey: ["locationStats"],
    queryFn: async () => {
      // Mock location data
      return [
        { name: "Paris, France", latitude: 48.8566, longitude: 2.3522, count: 3 },
        { name: "Tokyo, Japan", latitude: 35.6762, longitude: 139.6503, count: 2 },
        { name: "New York, USA", latitude: 40.7128, longitude: -74.0060, count: 5 },
        { name: "Sydney, Australia", latitude: -33.8688, longitude: 151.2093, count: 1 },
        { name: "London, UK", latitude: 51.5074, longitude: -0.1278, count: 4 },
        { name: "Dubai, UAE", latitude: 25.2048, longitude: 55.2708, count: 2 },
      ];
    },
  });
};
*/
