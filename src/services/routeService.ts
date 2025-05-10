import api from "./api";

export interface Route {
  id: string;
  type: string;
  attributes: {
    long_name: string;
    short_name: string;
    description: string;
    type: number;
    color: string;
    text_color: string;
  };
}

export interface Trip {
  id: string;
  type: string;
  attributes: {
    name: string;
    headsign: string;
    direction_id: number;
  };
  relationships: {
    route: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

export const getRoutes = () => {
  return api.get("/routes", {
    params: {
      "filter[type]": "0,1,2,3,4", // All transit types
      sort: "long_name",
    },
  });
};

export const getTrips = (routeId?: string) => {
  return api.get("/trips", {
    params: {
      ...(routeId && { "filter[route]": routeId }),
      sort: "name",
    },
  });
};
