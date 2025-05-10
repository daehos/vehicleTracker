import { useState, useEffect } from "react";
import {
  getRoutes,
  getTrips,
  type Route,
  type Trip,
} from "../services/routeService";

export const useRoutesAndTrips = (selectedRouteId?: string) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch routes
  useEffect(() => {
    setLoading(true);
    getRoutes()
      .then((res) => {
        setRoutes(res.data.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching routes:", err);
        setError("Failed to load routes");
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch trips when route is selected
  useEffect(() => {
    if (selectedRouteId) {
      setLoading(true);
      getTrips(selectedRouteId)
        .then((res) => {
          setTrips(res.data.data);
          setError(null);
        })
        .catch((err) => {
          console.error("Error fetching trips:", err);
          setError("Failed to load trips");
        })
        .finally(() => setLoading(false));
    } else {
      setTrips([]);
    }
  }, [selectedRouteId]);

  return {
    routes,
    trips,
    loading,
    error,
  };
};
