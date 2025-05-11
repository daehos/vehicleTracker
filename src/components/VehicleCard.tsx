import { useState } from "react";
import type { Vehicle } from "../services/vehicleService";
import VehicleDetailsPopup from "./VehicleDetailsPopup";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

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

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">
              {statusInfo.emoji} Vehicle {vehicle.attributes.label}
            </h3>
            <span
              className={`inline-block px-2 py-1 rounded-full text-sm font-medium mt-1 ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(vehicle.attributes.updated_at).toLocaleTimeString()}
          </div>
        </div>
        <div className=" mt-2 text-sm text-gray-600">
          <p className="mr-5">
          📍 Latitude & Longitude:
          </p>
          <p> 
            {vehicle.attributes.latitude.toFixed(6)}{" "}{vehicle.attributes.longitude.toFixed(6)}
          </p>
        </div>
      </div>

      {showDetails && (
        <VehicleDetailsPopup
          vehicle={vehicle}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default VehicleCard;
