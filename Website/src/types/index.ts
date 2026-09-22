export type MenuCategoryKey =
  | 'starters'
  | 'soups-salads'
  | 'main-course'
  | 'breads'
  | 'indo-chinese'
  | 'rice-biryani'
  | 'desserts'
  | 'beverages';

export type DietaryType = 'veg' | 'vegan' | 'jain-available' | 'gluten-free' | 'contains-dairy' | 'contains-nuts';

export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  description: string;
  price: string;
  category: MenuCategoryKey;
  dietary?: DietaryType[];
  isSignature?: boolean;
  isChefSpecial?: boolean;
  spiceLevel?: 1 | 2 | 3;
  pairing?: string;
  image?: string;
}

export interface MenuCategory {
  key: MenuCategoryKey;
  label: string;
  sublabel?: string;
  description: string;
}

export interface SignatureDish {
  id: string;
  name: string;
  hindiName?: string;
  subtitle: string;
  description: string;
  category: string;
  price: string;
  image: string;
  flavorNotes: string[];
  heritageOrigin: string;
  winePairing: string;
  dietary: DietaryType[];
  prepTimeNote: string;
}

export interface PhilosophyPrinciple {
  number: string;
  title: string;
  hindiTitle?: string;
  tagline: string;
  hindiTagline?: string;
  description: string;
  hindiDescription?: string;
  quote: string;
  hindiQuote?: string;
  culturalElement: string;
}

export interface ExperiencePillar {
  id: string;
  title: string;
  hindiTitle: string;
  tagline: string;
  description: string;
  image: string;
  highlights: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'ambience' | 'dishes' | 'craft' | 'details' | 'ingredients';
  categoryLabel: string;
  image: string;
  caption: string;
  aspectRatio: 'portrait' | 'landscape' | 'square' | 'wide';
}

export interface ReservationData {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'garden-lawn' | 'poolside-deck' | 'family-gazebo' | 'air-conditioned-hall';
  occasion: 'none' | 'birthday' | 'anniversary' | 'business' | 'celebration' | 'date';
  specialRequests: string;
}

export interface RestaurantInfo {
  name: string;
  brandName: string;
  tagline: string;
  subheading: string;
  storyHeadline: string;
  hindiStoryHeadline?: string;
  storyLead: string;
  hindiStoryLead?: string;
  storyParagraph1: string;
  hindiStoryParagraph1?: string;
  storyParagraph2: string;
  hindiStoryParagraph2?: string;
  storyQuote: string;
  hindiStoryQuote?: string;
  address: {
    line1: string;
    area: string;
    city: string;
    postalCode: string;
    country: string;
    landmark: string;
  };
  contact: {
    phone: string;
    conciergePhone: string;
    email: string;
    pressEmail: string;
    eventsEmail: string;
  };
  hours: {
    lunchDays: string;
    lunchHours: string;
    dinnerDays: string;
    dinnerHours: string;
    closed: string;
  };
  social: {
    instagram: string;
    facebook: string;
    tripadvisor: string;
    michelinGuide: string;
  };
  accolades: {
    title: string;
    organization: string;
    year: string;
  }[];
}
