export interface ChargingStation {
  id: string;
  name: string;
  address: string;

  latitude: number;
  longitude: number;

  distance?: number;

  rating?: number;

  availableSlots?: number;
  totalSlots?: number;

  pricePerKwh?: number;

  connectorTypes?: string[];

  isOpen?: boolean;

  openingTime?: string;
  closingTime?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface ChargingSession {
  stationId: string;
  startTime: string;
  endTime?: string;
  energyConsumed?: number;
  totalCost?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}