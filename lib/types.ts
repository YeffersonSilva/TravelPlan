export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  destination: string;
  coverImage?: string;
  isCollaborative: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  days: Day[];
  collaborators?: User[];
}

export interface Day {
  id: string;
  date: string;
  itineraryId: string;
  items: ItineraryItem[];
}

export type ItemType = 'flight' | 'accommodation' | 'activity' | 'transport' | 'note';

export interface ItineraryItem {
  id: string;
  type: ItemType;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  dayId: string;
  votes?: number;
  voters?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Flight extends ItineraryItem {
  type: 'flight';
  airline?: string;
  flightNumber?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  bookingReference?: string;
}

export interface Accommodation extends ItineraryItem {
  type: 'accommodation';
  checkIn?: string;
  checkOut?: string;
  address?: string;
  bookingReference?: string;
  contactInfo?: string;
}

export interface Activity extends ItineraryItem {
  type: 'activity';
  cost?: number;
  currency?: string;
  bookingReference?: string;
  url?: string;
}

export interface Transport extends ItineraryItem {
  type: 'transport';
  transportType?: 'train' | 'bus' | 'car' | 'taxi' | 'other';
  bookingReference?: string;
}

export interface Note extends ItineraryItem {
  type: 'note';
  important?: boolean;
}