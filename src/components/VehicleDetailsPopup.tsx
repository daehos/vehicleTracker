import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Vehicle } from "../services/vehicleService";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface VehicleDetailsPopupProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const VehicleDetailsPopup = ({
  vehicle,
  onClose,
}: VehicleDetailsPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "IN_TRANSIT_TO":
        return {
          color: "bg-blue-100 text-blue-800",
          emoji: "🚌",
          label: "In Transit",
        };
      case "STOPPED_AT":
        return {
          color: "bg-yellow-100 text-yellow-800",
          emoji: "🛑",
          label: "Stopped",
        };
      case "INCOMING_AT":
        return {
          color: "bg-purple-100 text-purple-800",
          emoji: "⏳",
          label: "Incoming",
        };
      case "COMPLETED":
        return {
          color: "bg-green-100 text-green-800",
          emoji: "✅",
          label: "Completed",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          emoji: "❓",
          label: status?.toLowerCase().replace(/_/g, " "),
        };
    }
  };

  const statusInfo = getStatusInfo(vehicle.attributes.current_status);

  // Format timestamp to local time
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={popupRef}
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">
              {statusInfo.emoji} Vehicle {vehicle.attributes.label}
            </h2>
            <span
              className={`inline-block px-2 py-1 rounded-full text-sm font-medium mt-1 ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vehicle Information */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">📍 Location</h3>
              <p>Latitude: {vehicle.attributes.latitude}</p>
              <p>Longitude: {vehicle.attributes.longitude}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">🕒 Last Updated</h3>
              <p>{formatTimestamp(vehicle.attributes.updated_at)}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">🚏 Route</h3>
              <p>{vehicle.relationships.route.data.id}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">🎫 Trip</h3>
              <p>{vehicle.relationships.trip.data.id}</p>
            </div>
          </div>

          {/* Map */}
          <div className="h-[300px] rounded-lg overflow-hidden">
            <MapContainer
              center={[
                vehicle.attributes.latitude,
                vehicle.attributes.longitude,
              ]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[
                  vehicle.attributes.latitude,
                  vehicle.attributes.longitude,
                ]}
              >
                <Popup>
                  {statusInfo.emoji} Vehicle {vehicle.attributes.label}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPopup;
