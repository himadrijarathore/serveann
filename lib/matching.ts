import { Donation, Organization } from './types';
import { calculateDistance } from './utils';

export function findBestShelter(donation: Donation, organizations: Organization[]): Organization | null {
  const shelters = organizations.filter(org => org.id !== donation.donorOrgId && org.maxCapacityLbs > 0);

  const eligibleShelters = shelters.filter(org => {
    // Capacity check
    if (org.currentCapacityLbs + donation.estimatedLbs > org.maxCapacityLbs) {
      return false;
    }

    // Food category preference check (veg shelter won't accept nonveg)
    if (org.foodPreference === 'veg' && donation.foodCategory === 'nonveg') {
      return false;
    }
    if (org.foodPreference === 'nonveg' && donation.foodCategory === 'veg') {
      return false;
    }

    // Perishability check
    const perishableKeywords = ['fresh', 'cooked', 'curry', 'paneer', 'biryani', 'rice', 'dal', 'soup'];
    const isPerishable = perishableKeywords.some(kw => donation.foodType.toLowerCase().includes(kw));
    if (isPerishable && !org.acceptsPerishables) {
      return false;
    }

    // Distance check (25 km radius)
    const distance = calculateDistance(
      donation.pickupLocation.lat,
      donation.pickupLocation.lng,
      org.location.lat,
      org.location.lng
    );
    if (distance > 25) {
      return false;
    }

    return true;
  });

  if (eligibleShelters.length === 0) {
    return null;
  }

  // Sort by match score (distance + capacity)
  eligibleShelters.sort((a, b) => {
    const distA = calculateDistance(
      donation.pickupLocation.lat, donation.pickupLocation.lng,
      a.location.lat, a.location.lng
    );
    const distB = calculateDistance(
      donation.pickupLocation.lat, donation.pickupLocation.lng,
      b.location.lat, b.location.lng
    );
    const scoreA = calculateMatchScore(distA, a.maxCapacityLbs - a.currentCapacityLbs);
    const scoreB = calculateMatchScore(distB, b.maxCapacityLbs - b.currentCapacityLbs);
    return scoreB - scoreA;
  });

  return eligibleShelters[0];
}

export function calculateMatchScore(distance: number, capacityRemaining: number): number {
  const distanceScore = Math.max(0, 100 - (distance * 4));
  const capacityScore = Math.min(100, capacityRemaining / 10);
  return (distanceScore * 0.7) + (capacityScore * 0.3);
}
