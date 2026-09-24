import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Organization, Donation, Match, AppNotification, FoodCategory } from './types';
import { generateId } from './utils';
import { findBestShelter } from './matching';

interface AppState {
  currentUser: User | null;
  users: User[];
  organizations: Organization[];
  donations: Donation[];
  matches: Match[];
  notifications: AppNotification[];

  // Auth
  login: (email: string, password?: string) => boolean;
  signup: (name: string, email: string, password: string, role: string, phone: string) => boolean;
  logout: () => void;

  // Data actions
  addDonation: (donation: Omit<Donation, 'id' | 'status' | 'createdAt'>) => Donation;
  matchDonation: (donationId: string) => Match | null;
  claimMatch: (matchId: string, driverId: string) => void;
  completeDelivery: (matchId: string) => void;
  addOrganization: (org: Omit<Organization, 'id'>) => void;

  // Getters
  getOrganizationById: (id: string) => Organization | undefined;
  getDonationById: (id: string) => Donation | undefined;
  getUserById: (id: string) => User | undefined;
  getMatchById: (id: string) => Match | undefined;

  // Computed
  getImpactStats: () => {
    totalDonations: number;
    totalLbsRescued: number;
    mealsProvided: number;
    co2Diverted: number;
    activeShelters: number;
    activeDrivers: number;
  };

  // Notifications
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  getUserNotifications: (userId: string) => AppNotification[];
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const now = Date.now();
const hour = 3600000;
const day = 86400000;

const seedUsers: User[] = [
  // Donors
  { id: 'u1', name: 'Rajesh Kumar', email: 'donor@serveann.com', phone: '9876543210', role: 'donor', createdAt: new Date(now - 30 * day).toISOString() },
  { id: 'u4', name: 'Anita Desai', email: 'anita@tasteof.mumbai', phone: '9876543213', role: 'donor', createdAt: new Date(now - 25 * day).toISOString() },
  { id: 'u5', name: 'Vikram Singh', email: 'vikram@greenleaf.in', phone: '9876543214', role: 'donor', createdAt: new Date(now - 20 * day).toISOString() },
  { id: 'u6', name: 'Meera Joshi', email: 'meera@royalbanquets.com', phone: '9876543215', role: 'donor', createdAt: new Date(now - 15 * day).toISOString() },
  // Shelters (receivers)
  { id: 'u2', name: 'Priya Sharma', email: 'shelter@serveann.com', phone: '9876543211', role: 'shelter', createdAt: new Date(now - 30 * day).toISOString() },
  { id: 'u7', name: 'Suresh Nair', email: 'suresh@sahara.org', phone: '9876543216', role: 'shelter', createdAt: new Date(now - 22 * day).toISOString() },
  { id: 'u8', name: 'Lakshmi Iyer', email: 'lakshmi@bhojandaan.org', phone: '9876543217', role: 'shelter', createdAt: new Date(now - 18 * day).toISOString() },
  // Drivers
  { id: 'u3', name: 'Amit Patel', email: 'driver@serveann.com', phone: '9876543212', role: 'driver', createdAt: new Date(now - 30 * day).toISOString() },
  { id: 'u9', name: 'Rohit Mehta', email: 'rohit.mehta@gmail.com', phone: '9876543218', role: 'driver', createdAt: new Date(now - 14 * day).toISOString() },
  { id: 'u10', name: 'Kavita Reddy', email: 'kavita.reddy@gmail.com', phone: '9876543219', role: 'driver', createdAt: new Date(now - 10 * day).toISOString() },
  { id: 'u11', name: 'Farhan Sheikh', email: 'farhan.sheikh@gmail.com', phone: '9876543220', role: 'driver', createdAt: new Date(now - 7 * day).toISOString() },
];

const seedOrgs: Organization[] = [
  // Donor orgs
  { id: 'o1', ownerId: 'u1', name: 'Spice Garden Restaurant', address: 'Colaba, Mumbai', location: { lat: 19.076, lng: 72.8777 }, acceptsPerishables: true, foodPreference: 'both', maxCapacityLbs: 1000, currentCapacityLbs: 0 },
  { id: 'o5', ownerId: 'u4', name: 'Taste of Mumbai Kitchen', address: 'Bandra West, Mumbai', location: { lat: 19.0596, lng: 72.8295 }, acceptsPerishables: true, foodPreference: 'both', maxCapacityLbs: 800, currentCapacityLbs: 0 },
  { id: 'o6', ownerId: 'u5', name: 'Green Leaf Pure Veg Catering', address: 'Andheri East, Mumbai', location: { lat: 19.1136, lng: 72.8697 }, acceptsPerishables: true, foodPreference: 'veg', maxCapacityLbs: 600, currentCapacityLbs: 0 },
  { id: 'o7', ownerId: 'u6', name: 'Royal Banquets & Events', address: 'Powai, Mumbai', location: { lat: 19.1176, lng: 72.9060 }, acceptsPerishables: true, foodPreference: 'both', maxCapacityLbs: 1500, currentCapacityLbs: 0 },
  // Shelter orgs (receivers)
  { id: 'o2', ownerId: 'u2', name: 'Mumbai Food Bank', address: 'Dadar, Mumbai', location: { lat: 19.0178, lng: 72.8478 }, acceptsPerishables: true, foodPreference: 'both', maxCapacityLbs: 500, currentCapacityLbs: 120 },
  { id: 'o3', ownerId: 'u2', name: 'Annapurna Shelter', address: 'Lower Parel, Mumbai', location: { lat: 19.0330, lng: 72.8397 }, acceptsPerishables: false, foodPreference: 'veg', maxCapacityLbs: 300, currentCapacityLbs: 80 },
  { id: 'o4', ownerId: 'u2', name: 'Hope Kitchen', address: 'Kurla, Mumbai', location: { lat: 19.0896, lng: 72.8656 }, acceptsPerishables: true, foodPreference: 'both', maxCapacityLbs: 200, currentCapacityLbs: 30 },
  { id: 'o8', ownerId: 'u7', name: 'Sahara Foundation', address: 'Malad West, Mumbai', location: { lat: 19.1860, lng: 72.8485 }, acceptsPerishables: true, foodPreference: 'both', maxCapacityLbs: 400, currentCapacityLbs: 150 },
  { id: 'o9', ownerId: 'u8', name: 'Bhojan Daan Trust', address: 'Borivali, Mumbai', location: { lat: 19.2307, lng: 72.8567 }, acceptsPerishables: true, foodPreference: 'veg', maxCapacityLbs: 350, currentCapacityLbs: 60 },
];

const seedDonations: Donation[] = [
  // Delivered donations (past)
  { id: 'd1', donorOrgId: 'o1', foodType: 'Cooked Rice & Dal', foodCategory: 'veg', estimatedLbs: 50, expiryTime: new Date(now - 5 * day).toISOString(), status: 'delivered', pickupLocation: { lat: 19.076, lng: 72.8777 }, createdAt: new Date(now - 6 * day).toISOString() },
  { id: 'd3', donorOrgId: 'o5', foodType: 'Chicken Biryani', foodCategory: 'nonveg', estimatedLbs: 35, expiryTime: new Date(now - 3 * day).toISOString(), status: 'delivered', pickupLocation: { lat: 19.0596, lng: 72.8295 }, createdAt: new Date(now - 4 * day).toISOString() },
  { id: 'd4', donorOrgId: 'o6', foodType: 'Paneer Tikka & Starters', foodCategory: 'veg', estimatedLbs: 18, expiryTime: new Date(now - 2 * day).toISOString(), status: 'delivered', pickupLocation: { lat: 19.1136, lng: 72.8697 }, createdAt: new Date(now - 3 * day).toISOString() },
  { id: 'd5', donorOrgId: 'o7', foodType: 'Butter Chicken & Naan', foodCategory: 'nonveg', estimatedLbs: 28, expiryTime: new Date(now - 1 * day).toISOString(), status: 'delivered', pickupLocation: { lat: 19.1176, lng: 72.9060 }, createdAt: new Date(now - 2 * day).toISOString() },
  { id: 'd6', donorOrgId: 'o1', foodType: 'Veg Biryani & Raita', foodCategory: 'veg', estimatedLbs: 40, expiryTime: new Date(now - 1 * day).toISOString(), status: 'delivered', pickupLocation: { lat: 19.076, lng: 72.8777 }, createdAt: new Date(now - 2 * day).toISOString() },
  { id: 'd7', donorOrgId: 'o5', foodType: 'Idli, Dosa & Sambar', foodCategory: 'veg', estimatedLbs: 22, expiryTime: new Date(now - 12 * hour).toISOString(), status: 'delivered', pickupLocation: { lat: 19.0596, lng: 72.8295 }, createdAt: new Date(now - 1 * day).toISOString() },
  { id: 'd8', donorOrgId: 'o6', foodType: 'Chole Bhature', foodCategory: 'veg', estimatedLbs: 15, expiryTime: new Date(now - 6 * hour).toISOString(), status: 'delivered', pickupLocation: { lat: 19.1136, lng: 72.8697 }, createdAt: new Date(now - 18 * hour).toISOString() },
  { id: 'd9', donorOrgId: 'o7', foodType: 'Tandoori Chicken & Kebabs', foodCategory: 'nonveg', estimatedLbs: 20, expiryTime: new Date(now - 4 * hour).toISOString(), status: 'delivered', pickupLocation: { lat: 19.1176, lng: 72.9060 }, createdAt: new Date(now - 12 * hour).toISOString() },
  // Active donations
  { id: 'd2', donorOrgId: 'o1', foodType: 'Mixed Breads & Naan', foodCategory: 'veg', estimatedLbs: 20, expiryTime: new Date(now + 24 * hour).toISOString(), status: 'matched', pickupLocation: { lat: 19.076, lng: 72.8777 }, createdAt: new Date(now - 2 * hour).toISOString() },
  { id: 'd10', donorOrgId: 'o5', foodType: 'Fish Curry & Rice', foodCategory: 'nonveg', estimatedLbs: 16, expiryTime: new Date(now + 4 * hour).toISOString(), status: 'matched', pickupLocation: { lat: 19.0596, lng: 72.8295 }, createdAt: new Date(now - 1 * hour).toISOString() },
  { id: 'd11', donorOrgId: 'o7', foodType: 'Fresh Fruit Platter', foodCategory: 'veg', estimatedLbs: 12, expiryTime: new Date(now + 18 * hour).toISOString(), status: 'pending', pickupLocation: { lat: 19.1176, lng: 72.9060 }, createdAt: new Date(now - 30 * 60000).toISOString() },
];

const seedMatches: Match[] = [
  // Completed matches
  { id: 'm1', donationId: 'd1', shelterOrgId: 'o2', driverId: 'u3', status: 'completed', createdAt: new Date(now - 6 * day).toISOString() },
  { id: 'm2', donationId: 'd3', shelterOrgId: 'o4', driverId: 'u9', status: 'completed', createdAt: new Date(now - 4 * day).toISOString() },
  { id: 'm3', donationId: 'd4', shelterOrgId: 'o3', driverId: 'u10', status: 'completed', createdAt: new Date(now - 3 * day).toISOString() },
  { id: 'm4', donationId: 'd5', shelterOrgId: 'o8', driverId: 'u3', status: 'completed', createdAt: new Date(now - 2 * day).toISOString() },
  { id: 'm5', donationId: 'd6', shelterOrgId: 'o9', driverId: 'u11', status: 'completed', createdAt: new Date(now - 2 * day).toISOString() },
  { id: 'm6', donationId: 'd7', shelterOrgId: 'o2', driverId: 'u9', status: 'completed', createdAt: new Date(now - 1 * day).toISOString() },
  { id: 'm7', donationId: 'd8', shelterOrgId: 'o3', driverId: 'u10', status: 'completed', createdAt: new Date(now - 18 * hour).toISOString() },
  { id: 'm8', donationId: 'd9', shelterOrgId: 'o4', driverId: 'u11', status: 'completed', createdAt: new Date(now - 12 * hour).toISOString() },
  // Active matches
  { id: 'm9', donationId: 'd2', shelterOrgId: 'o4', driverId: 'u3', status: 'in_transit', createdAt: new Date(now - 2 * hour).toISOString() },
  { id: 'm10', donationId: 'd10', shelterOrgId: 'o2', driverId: null, status: 'awaiting_driver', createdAt: new Date(now - 1 * hour).toISOString() },
];

const seedNotifications: AppNotification[] = [
  { id: 'n1', userId: 'all_drivers', title: 'New Delivery Available', message: '16 lbs of Fish Curry & Rice ready for pickup from Taste of Mumbai Kitchen → Mumbai Food Bank', type: 'dispatch', read: false, createdAt: new Date(now - 1 * hour).toISOString() },
  { id: 'n2', userId: 'all_drivers', title: 'New Delivery Available', message: '20 lbs of Mixed Breads & Naan ready for pickup from Spice Garden Restaurant → Hope Kitchen', type: 'dispatch', read: false, createdAt: new Date(now - 2 * hour).toISOString() },
];

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: seedUsers,
      organizations: seedOrgs,
      donations: seedDonations,
      matches: seedMatches,
      notifications: seedNotifications,

      login: (email: string) => {
        const user = get().users.find(u => u.email === email);
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      signup: (name: string, email: string, _password: string, role: string, phone: string) => {
        const newUser: User = {
          name,
          email,
          role: role.toLowerCase() as User['role'],
          phone,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set(state => ({ users: [...state.users, newUser], currentUser: newUser }));
        return true;
      },

      logout: () => set({ currentUser: null }),

      addDonation: (donationData) => {
        const newDonation: Donation = {
          ...donationData,
          id: generateId(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set(state => ({ donations: [...state.donations, newDonation] }));

        // Auto-trigger matching
        get().matchDonation(newDonation.id);

        return newDonation;
      },

      matchDonation: (donationId) => {
        const { donations, organizations } = get();
        const donation = donations.find(d => d.id === donationId);
        if (!donation) return null;

        const bestShelter = findBestShelter(donation, organizations);
        if (!bestShelter) return null;

        const newMatch: Match = {
          id: generateId(),
          donationId: donation.id,
          shelterOrgId: bestShelter.id,
          driverId: null,
          status: 'awaiting_driver',
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          matches: [...state.matches, newMatch],
          donations: state.donations.map(d => d.id === donationId ? { ...d, status: 'matched' as const } : d),
        }));

        // Notify drivers
        const donorOrg = get().getOrganizationById(donation.donorOrgId);
        const vegLabel = donation.foodCategory === 'veg' ? '🟢 Veg' : '🔴 Non-veg';
        get().addNotification({
          userId: 'all_drivers',
          title: 'New Delivery Available',
          message: `${vegLabel} — ${donation.estimatedLbs} lbs of ${donation.foodType} from ${donorOrg?.name || 'Donor'} → ${bestShelter.name}`,
          type: 'dispatch',
        });

        return newMatch;
      },

      claimMatch: (matchId, driverId) => {
        set(state => ({
          matches: state.matches.map(m => m.id === matchId ? { ...m, driverId, status: 'in_transit' as const } : m),
          donations: state.donations.map(d => {
            const match = state.matches.find(m => m.id === matchId);
            if (match && d.id === match.donationId) {
              return { ...d, status: 'claimed' as const };
            }
            return d;
          })
        }));
      },

      completeDelivery: (matchId) => {
        const match = get().matches.find(m => m.id === matchId);
        if (!match) return;
        const donation = get().donations.find(d => d.id === match.donationId);
        if (!donation) return;

        set(state => ({
          matches: state.matches.map(m => m.id === matchId ? { ...m, status: 'completed' as const } : m),
          donations: state.donations.map(d => d.id === match.donationId ? { ...d, status: 'delivered' as const } : d),
          organizations: state.organizations.map(o => o.id === match.shelterOrgId ? { ...o, currentCapacityLbs: o.currentCapacityLbs + donation.estimatedLbs } : o),
        }));
      },

      addOrganization: (orgData) => {
        const newOrg: Organization = {
          ...orgData,
          id: generateId(),
        };
        set(state => ({ organizations: [...state.organizations, newOrg] }));
      },

      getOrganizationById: (id) => get().organizations.find(o => o.id === id),
      getDonationById: (id) => get().donations.find(d => d.id === id),
      getUserById: (id) => get().users.find(u => u.id === id),
      getMatchById: (id) => get().matches.find(m => m.id === id),

      getImpactStats: () => {
        const { donations, users, organizations } = get();
        const delivered = donations.filter(d => d.status === 'delivered');
        const totalLbs = delivered.reduce((sum, d) => sum + d.estimatedLbs, 0);

        return {
          totalDonations: delivered.length,
          totalLbsRescued: totalLbs,
          mealsProvided: Math.round(totalLbs * 1.2),
          co2Diverted: parseFloat((totalLbs * 1.9).toFixed(1)),
          activeShelters: organizations.filter(o => o.maxCapacityLbs > 0 && o.ownerId !== 'u1' && o.ownerId !== 'u4' && o.ownerId !== 'u5' && o.ownerId !== 'u6').length,
          activeDrivers: users.filter(u => u.role === 'driver').length,
        };
      },

      addNotification: (notifData) => {
        const newNotif: AppNotification = {
          ...notifData,
          id: generateId(),
          read: false,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ notifications: [newNotif, ...state.notifications] }));
      },

      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        }));
      },

      getUserNotifications: (userId) => {
        const notifs = get().notifications;
        return notifs.filter(n => n.userId === userId || n.userId === 'all_drivers');
      },
    }),
    {
      name: 'serveann-db',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // SSR fallback - noop storage
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users,
        organizations: state.organizations,
        donations: state.donations,
        matches: state.matches,
        notifications: state.notifications,
      }),
    }
  )
);
