import { useQuery } from "@tanstack/react-query";
// import { supabase } from "../lib/supabaseClient"; // Comment this out for now

/**
 * MOCK DATA VERSIONS - Using fake data to test charts
 */

export const useStatusStats = () => {
  return useQuery({
    queryKey: ["statusStats"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return [
        { status: "Pending", count: 8 },
        { status: "In Progress", count: 5 },
        { status: "Completed", count: 12 },
        { status: "Cancelled", count: 2 },
      ];
    },
  });
};

export const usePriorityStats = () => {
  return useQuery({
    queryKey: ["priorityStats"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      return [
        { priority: "low", count: 10 },
        { priority: "medium", count: 8 },
        { priority: "high", count: 7 },
      ];
    },
  });
};

export const useEventsTimeSeries = () => {
  return useQuery({
    queryKey: ["eventsTimeSeries"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.toISOString().split("T")[0];

        result.push({
          day,
          event_count: Math.floor(Math.random() * 15) + 2, // Random 2-16
        });
      }

      return result;
    },
  });
};

export const useActivityHeatmap = () => {
  return useQuery({
    queryKey: ["activityHeatmap"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

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
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock location data
      return [
        {
          name: "Paris, France",
          latitude: 48.8566,
          longitude: 2.3522,
          count: 3,
        },
        {
          name: "Tokyo, Japan",
          latitude: 35.6762,
          longitude: 139.6503,
          count: 2,
        },
        {
          name: "New York, USA",
          latitude: 40.7128,
          longitude: -74.006,
          count: 5,
        },
        {
          name: "Sydney, Australia",
          latitude: -33.8688,
          longitude: 151.2093,
          count: 1,
        },
        { name: "London, UK", latitude: 51.5074, longitude: -0.1278, count: 4 },
        { name: "Dubai, UAE", latitude: 25.2048, longitude: 55.2708, count: 2 },
        {
          name: "Chennai, India",
          latitude: 13.0827,
          longitude: 80.2707,
          count: 3,
        },
      ];
    },
  });
};
