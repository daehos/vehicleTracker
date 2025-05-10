import api from "./api";

export interface Vehicle {
  id: string;
  type: string;
  attributes: {
    label: string;
    latitude: number;
    longitude: number;
    current_status: string;
    updated_at: string;
  };
  relationships: {
    route: {
      data: {
        id: string;
        type: string;
      };
    };
    trip: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

export const getVehicles = (
  limit = 10,
  offset = 0,
  route?: string,
  trip?: string
) => {
  return api.get("/vehicles", {
    params: {
      "page[limit]": limit,
      "page[offset]": offset,
      ...(route && { "filter[route]": route }),
      ...(trip && { "filter[trip]": trip }),
    },
    headers: {
      Accept: "application/vnd.api+json",
    },
  });
};

export const getVehicleDetail = (id: string) => {
  return api.get(`/vehicles/${id}`);
};
