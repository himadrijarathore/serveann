import { FoodCategory } from './types';

const vegItems = [
  { foodType: 'Cooked Rice & Dal', estimatedWeight: 18, expiryWindowHours: 6 },
  { foodType: 'Fresh Vegetable Curry', estimatedWeight: 12, expiryWindowHours: 8 },
  { foodType: 'Assorted Breads & Naan', estimatedWeight: 8, expiryWindowHours: 36 },
  { foodType: 'Mixed Fruit Platter', estimatedWeight: 10, expiryWindowHours: 18 },
  { foodType: 'Paneer Tikka & Starters', estimatedWeight: 7, expiryWindowHours: 6 },
  { foodType: 'Veg Biryani & Pulao', estimatedWeight: 22, expiryWindowHours: 8 },
  { foodType: 'Sweets & Desserts (Gulab Jamun, Rasgulla)', estimatedWeight: 6, expiryWindowHours: 48 },
  { foodType: 'Dal Makhani & Soup', estimatedWeight: 15, expiryWindowHours: 10 },
  { foodType: 'Idli, Dosa & Sambar', estimatedWeight: 14, expiryWindowHours: 5 },
  { foodType: 'Chole Bhature & Puri', estimatedWeight: 11, expiryWindowHours: 7 },
];

const nonVegItems = [
  { foodType: 'Chicken Biryani', estimatedWeight: 25, expiryWindowHours: 6 },
  { foodType: 'Butter Chicken & Gravy', estimatedWeight: 12, expiryWindowHours: 5 },
  { foodType: 'Mutton Curry & Rogan Josh', estimatedWeight: 10, expiryWindowHours: 5 },
  { foodType: 'Tandoori Chicken & Kebabs', estimatedWeight: 8, expiryWindowHours: 4 },
  { foodType: 'Fish Fry & Prawn Masala', estimatedWeight: 9, expiryWindowHours: 4 },
  { foodType: 'Egg Curry & Omelettes', estimatedWeight: 7, expiryWindowHours: 6 },
  { foodType: 'Chicken Fried Rice & Noodles', estimatedWeight: 18, expiryWindowHours: 5 },
  { foodType: 'Seekh Kebab & Shammi Kebab', estimatedWeight: 6, expiryWindowHours: 5 },
];

export async function analyzeFoodImage(imageUrl: string): Promise<{
  foodType: string;
  foodCategory: FoodCategory;
  estimatedWeight: number;
  expiryWindowHours: number;
  confidence: number;
}> {
  // TODO: Replace with actual Gemini/OpenAI Vision API call when we get the API key
  // For the hackathon demo, we are using a heuristics-based fallback to simulate the API response
  // as the real API requires a paid tier.
  
  await new Promise(resolve => setTimeout(resolve, 1500)); // Network latency simulation

  const isVeg = Math.random() > 0.4;
  const items = isVeg ? vegItems : nonVegItems;
  const item = items[Math.floor(Math.random() * items.length)];

  const weightVariation = 0.7 + Math.random() * 0.6;
  const estimatedWeight = Math.round(item.estimatedWeight * weightVariation * 10) / 10;
  
  const expiryVariation = 0.8 + Math.random() * 0.4;
  const expiryWindowHours = Math.round(item.expiryWindowHours * expiryVariation);

  return {
    foodType: item.foodType,
    foodCategory: isVeg ? 'veg' : 'nonveg',
    estimatedWeight,
    expiryWindowHours,
    confidence: Math.round((85 + Math.random() * 13) * 10) / 10,
  };
}
