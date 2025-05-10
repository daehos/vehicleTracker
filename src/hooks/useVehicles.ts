import { useEffect, useState } from "react";
import type { Vehicle } from "../types/vehicle";
import { getVehicles } from "../services/vehicleService";

interface PaginationLinks {
  first: string;
  last: string;
  next: string | null;
  prev: string | null;
}

export const useVehicles = (
  page = 0,
  route?: string,
  trip?: string,
  pageSize = 10
) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [links, setLinks] = useState<PaginationLinks | null>(null);

  useEffect(() => {
    setLoading(true);
    getVehicles(pageSize, page * pageSize, route, trip)
      .then((res) => {
        console.log("API Response:", res.data);
        setVehicles(res.data.data);
        setLinks(res.data.links);

        // Calculate total count from the last page link
        if (res.data.links?.last) {
          const lastPageUrl = new URL(res.data.links.last);
          const lastOffset = parseInt(
            lastPageUrl.searchParams.get("page[offset]") || "0"
          );
          const total = lastOffset + pageSize; // Add pageSize because offset is 0-based
          setTotalCount(total);
        } else {
          // Fallback to current page size if no last page link
          setTotalCount((page + 1) * pageSize);
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [page, route, trip, pageSize]);

  return { vehicles, loading, error, totalCount, links };
};
