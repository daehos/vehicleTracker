import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VehicleCard from "../components/VehicleCard";
import { useVehicles } from "../hooks/useVehicles";
import { useRoutesAndTrips } from "../hooks/useRoutesAndTrips";
import type { Trip } from "../services/routeService";

// Available options for how many items to show per page
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const Home = () => {
  // State for pagination and filtering
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [routeFilter, setRouteFilter] = useState("");
  const [tripFilter, setTripFilter] = useState("");

  // Fetch vehicles data with current filters and pagination
  const {
    vehicles,
    loading: vehiclesLoading,
    error: vehiclesError,
    totalCount,
    links,
  } = useVehicles(page, routeFilter, tripFilter, pageSize);

  // Fetch available routes and trips for filtering
  const {
    routes,
    trips,
    loading: filtersLoading,
    error: filtersError,
  } = useRoutesAndTrips(routeFilter);

  // Show error notification if vehicle data fails to load
  useEffect(() => {
    if (vehiclesError) {
      toast.error(`Failed to load vehicles: ${vehiclesError}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [vehiclesError]);

  // Show error notification if filter data fails to load
  useEffect(() => {
    if (filtersError) {
      toast.error(`Failed to load filters: ${filtersError}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [filtersError]);

  // Calculate pagination values
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem = vehicles.length > 0 ? page * pageSize + 1 : 0;
  const endItem = Math.min((page + 1) * pageSize, totalCount);

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // Handle page size changes
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0); // Reset to first page when changing page size
  };

  // Handle route filter changes
  const handleRouteChange = (routeId: string) => {
    setRouteFilter(routeId);
    setTripFilter(""); // Clear trip filter when route changes
    setPage(0); // Reset to first page
  };

  // Handle trip filter changes
  const handleTripChange = (tripId: string) => {
    setTripFilter(tripId);
    setPage(0); // Reset to first page
  };

  // Extract page number from pagination URL
  const getPageFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const offset = parseInt(urlObj.searchParams.get("page[offset]") || "0");
      return Math.floor(offset / pageSize);
    } catch {
      return 0;
    }
  };

  // Get details of currently selected route
  const selectedRoute = routes.find((route) => route.id === routeFilter);

  // Format trip display name with destination and ID
  const formatTripLabel = (trip: Trip) => {
    const headsign =
      trip.attributes.headsign || trip.attributes.name || "Unknown Destination";
    const tripId = trip.id.slice(-4); // Get last 4 characters of trip ID
    return `${headsign} (${tripId})`;
  };

  return (
    <div className="p-4">
      {/* Toast notifications container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <h1 className="text-2xl font-bold mb-4">Vehicle List</h1>

      {/* Filter controls section */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          {/* Route selection dropdown */}
          <div className="flex flex-col gap-1">
            <label htmlFor="route-select" className="text-sm text-gray-600">
              Filter by Route
            </label>
            <select
              id="route-select"
              value={routeFilter}
              onChange={(e) => handleRouteChange(e.target.value)}
              className="border p-2 rounded min-w-[200px]"
              disabled={filtersLoading}
            >
              <option value="">All Routes</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.attributes.long_name}
                </option>
              ))}
            </select>
          </div>

          {/* Trip selection dropdown */}
          <div className="flex flex-col gap-1">
            <label htmlFor="trip-select" className="text-sm text-gray-600">
              {selectedRoute
                ? `Trips for ${selectedRoute.attributes.long_name}`
                : "Filter by Trip"}
            </label>
            <select
              id="trip-select"
              value={tripFilter}
              onChange={(e) => handleTripChange(e.target.value)}
              className="border p-2 rounded min-w-[200px]"
              disabled={filtersLoading || !routeFilter}
            >
              <option value="">All Trips</option>
              {trips
                .filter(
                  (trip) => trip.relationships.route.data.id === routeFilter
                )
                .map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {formatTripLabel(trip)}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Vehicle per page:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border rounded p-1 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading spinner */}
      {(vehiclesLoading || filtersLoading) && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Vehicle cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>

      {/* Pagination section */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Data range display */}
        <div className="text-sm text-gray-600">
          {vehicles.length > 0
            ? `Showing ${startItem}-${endItem} from ${totalCount} Data`
            : "Tidak ada data yang ditampilkan"}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          {/* First page button */}
          <button
            onClick={() =>
              links?.first && handlePageChange(getPageFromUrl(links.first))
            }
            disabled={!links?.first}
            className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            &laquo;
          </button>
          {/* Previous page button */}
          <button
            onClick={() =>
              links?.prev && handlePageChange(getPageFromUrl(links.prev))
            }
            disabled={!links?.prev}
            className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            &lsaquo;
          </button>

          {/* Page number buttons */}
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, index) => {
              if (
                index === 0 ||
                index === totalPages - 1 ||
                (index >= page - 1 && index <= page + 1)
              ) {
                return (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index)}
                    className={`px-3 py-1 rounded border ${
                      page === index
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              } else if (
                (index === 1 && page > 2) ||
                (index === totalPages - 2 && page < totalPages - 3)
              ) {
                return <span key={index}>...</span>;
              }
              return null;
            })}
          </div>

          {/* Next page button */}
          <button
            onClick={() =>
              links?.next && handlePageChange(getPageFromUrl(links.next))
            }
            disabled={!links?.next}
            className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            &rsaquo;
          </button>
          {/* Last page button */}
          <button
            onClick={() =>
              links?.last && handlePageChange(getPageFromUrl(links.last))
            }
            disabled={!links?.last}
            className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
