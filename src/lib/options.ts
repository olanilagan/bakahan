// Fixed choices used by forms and filters. Values are what we store in the
// database; labels come from src/i18n/ui.ts (except regions, which are proper nouns).

export const REGIONS = [
  'NCR',
  'CAR',
  'Ilocos Region (I)',
  'Cagayan Valley (II)',
  'Central Luzon (III)',
  'CALABARZON (IV-A)',
  'MIMAROPA',
  'Bicol Region (V)',
  'Western Visayas (VI)',
  'Negros Island Region (NIR)',
  'Central Visayas (VII)',
  'Eastern Visayas (VIII)',
  'Zamboanga Peninsula (IX)',
  'Northern Mindanao (X)',
  'Davao Region (XI)',
  'SOCCSKSARGEN (XII)',
  'Caraga (XIII)',
  'BARMM',
] as const;

export const ROLES = ['raiser', 'trader', 'buyer', 'student', 'business', 'other'] as const;
export const ANIMAL_TYPES = ['bull', 'steer', 'cow', 'heifer', 'calf', 'feeder', 'breeder', 'mixed'] as const;
export const PRICE_KINDS = ['liveweight', 'carcass', 'retail'] as const;
export const PRICE_CLASSES = ['any', 'bull', 'steer', 'cow', 'heifer', 'feeder'] as const;
export const PRICE_UNITS = ['head', 'kg', 'negotiable'] as const;
export const BIZ_CATEGORIES = ['feeds', 'vet', 'trader', 'breeder', 'equipment', 'transport', 'finance', 'agritech', 'other'] as const;

export function oneOf<T extends readonly string[]>(list: T, value: unknown): T[number] | null {
  return typeof value === 'string' && (list as readonly string[]).includes(value) ? (value as T[number]) : null;
}
