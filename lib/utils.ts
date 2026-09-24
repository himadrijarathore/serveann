export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatRelativeTime(dateStr: string): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const time = new Date(dateStr).getTime();
  const now = new Date().getTime();
  const diffInSeconds = (time - now) / 1000;
  
  const absDiff = Math.abs(diffInSeconds);
  if (absDiff < 60) {
    return rtf.format(Math.round(diffInSeconds), 'second');
  } else if (absDiff < 3600) {
    return rtf.format(Math.round(diffInSeconds / 60), 'minute');
  } else if (absDiff < 86400) {
    return rtf.format(Math.round(diffInSeconds / 3600), 'hour');
  } else {
    return rtf.format(Math.round(diffInSeconds / 86400), 'day');
  }
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function lbsToMeals(lbs: number): number {
  return Math.round(lbs * 1.2);
}

export function lbsToKgCO2(lbs: number): number {
  return parseFloat((lbs * 1.9).toFixed(1));
}
