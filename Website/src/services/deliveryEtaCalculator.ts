export interface DeliveryZone {
  id: string;
  name: string;
  hindiName: string;
  distanceKm: number;
  transitMinutes: number;
  deliveryFee: number;
  keywords: string[];
}

export const HARDCODED_BASE_PREPARATION_MINUTES = 18; // Guaranteed Royal Kitchen tandoor & handi cooking
export const RESTAURANT_ORIGIN = {
  name: 'Panjtara Pure Veg',
  hindiName: 'पंजतारा शुद्ध शाकाहारी',
  location: 'Bypass Road, Near Ralamandal, Indore',
  pincode: '452016',
};

// Hardcoded delivery radius zones across Indore from Panjtara Bypass
export const INDORE_RADIUS_ZONES: DeliveryZone[] = [
  {
    id: 'bypass',
    name: 'Indore Bypass & Ralamandal',
    hindiName: 'इंदौर बायपास एवं रालामंडल',
    distanceKm: 2.5,
    transitMinutes: 9,
    deliveryFee: 0, // Free delivery close to restaurant
    keywords: ['bypass', 'ralamandal', 'silver springs', 'phoenix citadel', 'dudhhiya'],
  },
  {
    id: 'bicholi',
    name: 'Bicholi Mardana & Kanadia Road',
    hindiName: 'बिचोली मर्दाना एवं कनाड़िया रोड',
    distanceKm: 4.0,
    transitMinutes: 13,
    deliveryFee: 20,
    keywords: ['bicholi', 'mardana', 'kanadia', 'progress', 'sampat hills'],
  },
  {
    id: 'bengali',
    name: 'Bengali Square & Pipliyahana',
    hindiName: 'बंगाली चौराहा एवं पिपलियाहाना',
    distanceKm: 6.5,
    transitMinutes: 19,
    deliveryFee: 30,
    keywords: ['bengali', 'pipliyahana', 'world cup', 'khajrana', 'goyal nagar'],
  },
  {
    id: 'geeta-bhawan',
    name: 'Geeta Bhawan & AB Road',
    hindiName: 'गीता भवन एवं ए.बी. रोड',
    distanceKm: 7.5,
    transitMinutes: 22,
    deliveryFee: 30,
    keywords: ['geeta bhawan', 'ab road', 'manorama ganj', 'south tukoganj', 'navlakha'],
  },
  {
    id: 'palasia',
    name: 'Palasia & Old Palasia',
    hindiName: 'पलासिया एवं ओल्ड पलासिया',
    distanceKm: 8.5,
    transitMinutes: 24,
    deliveryFee: 35,
    keywords: ['palasia', 'new palasia', 'old palasia', 'chappan', '56 dukan', 'saket'],
  },
  {
    id: 'vijay-nagar',
    name: 'Vijay Nagar & Scheme 54',
    hindiName: 'विजय नगर एवं स्कीम ५४',
    distanceKm: 9.0,
    transitMinutes: 26,
    deliveryFee: 40,
    keywords: ['vijay nagar', 'scheme 54', 'scheme 74', 'sayaji', 'c21', 'malhar'],
  },
  {
    id: 'rau',
    name: 'Rau Circle & Silicon City',
    hindiName: 'राऊ सर्कल एवं सिलिकॉन सिटी',
    distanceKm: 11.0,
    transitMinutes: 30,
    deliveryFee: 40,
    keywords: ['rau', 'silicon city', 'cat', 'iim', 'shramik', 'teji mandir'],
  },
  {
    id: 'mr10',
    name: 'MR-10 & Super Corridor',
    hindiName: 'एम.आर.-१० एवं सुपर कॉरिडोर',
    distanceKm: 12.0,
    transitMinutes: 33,
    deliveryFee: 45,
    keywords: ['mr10', 'mr-10', 'super corridor', 'tcs', 'infosys', 'kumedi', 'chandragupt'],
  },
];

export interface DeliveryEtaResult {
  distanceKm: number;
  zoneName: string;
  zoneHindiName: string;
  prepMinutes: number;
  transitMinutes: number;
  totalEtaMinutes: number;
  estimatedArrivalDate: Date;
  estimatedArrivalFormatted: string;
  deliveryFee: number;
  isMatchedZone: boolean;
}

/**
 * Calculates transit minutes from distance in km using city traffic speeds
 * ~2.5 mins per km in Indore traffic + 3 mins dispatch and parking buffer
 */
export function calculateTransitMinutes(distanceKm: number): number {
  if (distanceKm <= 0) return 0;
  return Math.max(6, Math.round(distanceKm * 2.5 + 3));
}

/**
 * Determines distance and zone based on customer delivery address
 */
export function resolveDeliveryDistance(addressArea?: string, addressStreet?: string): {
  distanceKm: number;
  zoneName: string;
  zoneHindiName: string;
  deliveryFee: number;
  isMatchedZone: boolean;
} {
  const query = `${addressArea || ''} ${addressStreet || ''}`.toLowerCase().trim();

  if (query) {
    for (const zone of INDORE_RADIUS_ZONES) {
      const match = zone.keywords.some((kw) => query.includes(kw.toLowerCase()));
      if (match) {
        return {
          distanceKm: zone.distanceKm,
          zoneName: zone.name,
          zoneHindiName: zone.hindiName,
          deliveryFee: zone.deliveryFee,
          isMatchedZone: true,
        };
      }
    }
  }

  // Default average radius estimate within Indore Delivery Boundary
  return {
    distanceKm: 5.0,
    zoneName: addressArea ? `${addressArea} (Indore Radius)` : 'Indore Metro Area (~5 km)',
    zoneHindiName: addressArea ? `${addressArea} (इंदौर दायरा)` : 'इंदौर दायरा (~५ किमी)',
    deliveryFee: 25,
    isMatchedZone: false,
  };
}

/**
 * Calculate full delivery ETA given an order
 */
export function calculateOrderDeliveryEta(
  createdAt: string | Date,
  addressArea?: string,
  addressStreet?: string,
  totalItemsCount: number = 2
): DeliveryEtaResult {
  const zoneInfo = resolveDeliveryDistance(addressArea, addressStreet);

  // Scaled prep time: base 18 mins + small buffer for big orders (>6 items)
  let prepMinutes = HARDCODED_BASE_PREPARATION_MINUTES;
  if (totalItemsCount > 6) {
    prepMinutes += Math.min(7, Math.floor((totalItemsCount - 6) / 2));
  }

  const transitMinutes = calculateTransitMinutes(zoneInfo.distanceKm);
  const totalEtaMinutes = prepMinutes + transitMinutes;

  const orderCreated = new Date(createdAt);
  const arrivalTimestamp = orderCreated.getTime() + totalEtaMinutes * 60 * 1000;
  const estimatedArrivalDate = new Date(arrivalTimestamp);

  const estimatedArrivalFormatted = estimatedArrivalDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    distanceKm: zoneInfo.distanceKm,
    zoneName: zoneInfo.zoneName,
    zoneHindiName: zoneInfo.zoneHindiName,
    prepMinutes,
    transitMinutes,
    totalEtaMinutes,
    estimatedArrivalDate,
    estimatedArrivalFormatted,
    deliveryFee: zoneInfo.deliveryFee,
    isMatchedZone: zoneInfo.isMatchedZone,
  };
}

/**
 * Generic simulation calculator for custom distance radius
 */
export function simulateRadiusEta(
  distanceKm: number,
  customPrepMinutes: number = HARDCODED_BASE_PREPARATION_MINUTES
) {
  const transitMinutes = calculateTransitMinutes(distanceKm);
  const totalEtaMinutes = customPrepMinutes + transitMinutes;
  const now = new Date();
  const arrivalDate = new Date(now.getTime() + totalEtaMinutes * 60 * 1000);

  // Delivery fee estimation: free under 3km, then ~₹5 per 2km
  const fee = distanceKm <= 3.0 ? 0 : Math.min(60, 20 + Math.round((distanceKm - 3) * 3));

  return {
    distanceKm,
    prepMinutes: customPrepMinutes,
    transitMinutes,
    totalEtaMinutes,
    estimatedArrivalDate: arrivalDate,
    estimatedArrivalFormatted: arrivalDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    estimatedFee: fee,
  };
}
