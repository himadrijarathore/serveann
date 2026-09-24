export type UserRole = 'donor' | 'shelter' | 'driver';
export type FoodCategory = 'veg' | 'nonveg';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  acceptsPerishables: boolean;
  foodPreference: 'veg' | 'nonveg' | 'both';
  maxCapacityLbs: number;
  currentCapacityLbs: number;
}

export interface Donation {
  id: string;
  donorOrgId: string;
  foodType: string;
  foodCategory: FoodCategory;
  estimatedLbs: number;
  expiryTime: string;
  status: 'pending' | 'matched' | 'claimed' | 'delivered';
  pickupLocation: { lat: number; lng: number };
  imageUrl?: string;
  createdAt: string;
}

export interface Match {
  id: string;
  donationId: string;
  shelterOrgId: string;
  driverId: string | null;
  status: 'awaiting_driver' | 'in_transit' | 'completed';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'dispatch' | 'delivery' | 'info';
  read: boolean;
  createdAt: string;
}

export interface FoodAnalysis {
  foodType: string;
  foodCategory: FoodCategory;
  estimatedLbs: number;
  expiryHours: number;
  confidence: number;
}

export interface ImpactStats {
  totalDonations: number;
  totalLbsRescued: number;
  mealsProvided: number;
  co2Diverted: number;
  activeShelters: number;
  activeDrivers: number;
}
