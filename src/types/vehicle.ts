export interface Vehicle {
  id: string;
  type: string;
  links: {
    self: string;
  };
  attributes: {
    bearing: number;
    carriages: {
      label: string;
      occupancy_status: string;
      occupancy_percentage: number | null;
    }[];
    current_status: string;
    current_stop_sequence: number;
    direction_id: number;
    label: string;
    latitude: number;
    longitude: number;
    occupancy_status: string | null;
    revenue: string;
    speed: number;
    updated_at: string;
  };
  relationships: {
    route: {
      data: {
        id: string;
        type: string;
      };
    };
    stop?: {
      data: {
        id: string;
        type: string;
      };
    };
    trip?: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}
