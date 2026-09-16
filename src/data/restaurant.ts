import { RestaurantInfo, PhilosophyPrinciple, ExperiencePillar } from '../types/index.ts';

export const RESTAURANT_INFO: RestaurantInfo = {
  name: 'Panjtara Pure Veg',
  brandName: 'P A N J T A R A',
  tagline: '100% Pure Vegetarian Dining Sanctuary.',
  subheading: 'Open-air garden dining, poolside seating, and authentic royal vegetarian gastronomy in Indore.',
  storyHeadline: 'Shuddhata, Swad, Aur Sanjh.',
  storyLead:
    'Panjtara was created with an unwavering devotion: to offer families and connoisseurs a majestic 100% pure vegetarian dining experience where Malwa heritage, slow-tandoor craft, and lush open-sky tranquility meet.',
  storyParagraph1:
    'Located on Indore’s prominent Bypass Road, Panjtara invites you into an expansive realm of leafy garden lawns, poolside tables, and warm family dining spaces. Our kitchen celebrates the rich culinary traditions of India—from rich North Indian and Punjabi paneer delicacies to crisp earthen tandoor rotis and vibrant Indo-Chinese creations.',
  storyParagraph2:
    'Every dish is crafted in a strictly 100% pure vegetarian kitchen with sacred care for hygiene, freshness, and purity. From our signature Dal Panjtara and aromatic Paneer Lababdar to fresh hot Jowar Rotis, our hearth breathes authentic hospitality. Here, every evening under the starry Indore skies becomes an unforgettable celebration.',
  storyQuote: '“Purity is not merely an ingredient—it is our sacred tradition. In every preparation, we serve soul-satisfying vegetarian joy.”',
  address: {
    line1: 'Main Bypass Road, Near Bombay International School',
    area: 'In Front of Bharat Benz, Bicholi Mardana / Kanadia',
    city: 'Indore',
    postalCode: '452016',
    country: 'India',
    landmark: 'Opposite Bharat Benz Showroom, Indore Bypass',
  },
  contact: {
    phone: '+91 95220 10107',
    conciergePhone: '+91 95220 10107',
    email: 'info@panjtaraindore.com',
    pressEmail: 'events@panjtaraindore.com',
    eventsEmail: 'banquets@panjtaraindore.com',
  },
  hours: {
    lunchDays: 'Monday – Sunday',
    lunchHours: '11:00 AM – 3:30 PM',
    dinnerDays: 'Monday – Sunday',
    dinnerHours: '6:30 PM – 12:00 AM (Midnight)',
    closed: 'Open All 7 Days for Lunch & Dinner',
  },
  social: {
    instagram: 'https://instagram.com/panjtara_pure_veg',
    facebook: 'https://facebook.com/panjtarapureveg',
    tripadvisor: 'https://tripadvisor.com',
    michelinGuide: 'https://www.google.com/maps/place/Panjtara+Pure+Veg/@22.7381151,75.933332,17z/data=!4m6!3m5!1s0x3962e3a90e58642d:0xc05586d0124e2acd!8m2!3d22.7380896!4d75.9334818!16s%2Fg%2F11rwq6rp25',
  },
  accolades: [
    {
      title: '4.1★ on Google Reviews (3,500+ Guests)',
      organization: 'Google Verified Reviews',
      year: '2025',
    },
    {
      title: 'Best Pure Veg Garden Restaurant',
      organization: 'Indore Hospitality & Culinary Honors',
      year: '2025',
    },
    {
      title: 'Premier Family Dining & Banquet Destination',
      organization: 'Madhya Pradesh Food & Epicure Guide',
      year: '2024',
    },
    {
      title: 'Master of Tandoor & Paneer Delicacies',
      organization: 'Malwa Gastronomy Awards',
      year: '2024',
    },
  ],
};

export const PHILOSOPHY_PRINCIPLES: PhilosophyPrinciple[] = [
  {
    number: '01',
    title: 'SHUDDHATA (100% PURE VEG)',
    tagline: 'Sacred Vegetarian Purity & Sattvic Integrity',
    description:
      'A strictly 100% pure vegetarian sanctuary. No meat, no poultry, no seafood, and no eggs ever enter our premises, with dedicated Jain preparation available upon request.',
    quote: 'Pure food nourishes not only the body, but the spirit and conscious mind.',
    culturalElement: 'शुद्ध शाकाहारी (Shuddh Shakahari)',
  },
  {
    number: '02',
    title: 'MALWA & PUNJABI HEARTH',
    tagline: 'The Alchemy of Smoke & Seasoning',
    description:
      'From earthen tandoors baking crisp butter rotis and wholesome jowar rotis to slow-simmered rich paneer gravies, our chefs honor authentic dhaba and royal techniques.',
    quote: 'Traditional clay tandoors and brass deghs impart a depth of flavor that time cannot replace.',
    culturalElement: 'कारीगरी (Bespoke Craft)',
  },
  {
    number: '03',
    title: 'FARM-FRESH INGREDIENTS',
    tagline: 'Daily Churned Paneer & Golden Spices',
    description:
      'Fresh daily malai paneer, stone-ground whole spices, cold-pressed oils, pure desi ghee, and crisp farm-grown vegetables selected every dawn.',
    quote: 'True richness begins in honest soil and unadulterated ingredients.',
    culturalElement: 'ताज़गी (Uncompromised Freshness)',
  },
  {
    number: '04',
    title: 'FAMILY & OPEN-SKY HOSPITALITY',
    tagline: 'Warmth under the Indore Stars',
    description:
      'Sprawling outdoor gardens, romantic poolside cabanas, vibrant live music, and generous seating designed for families to celebrate life’s greatest milestones together.',
    quote: 'Atithi Devo Bhava—where every family dinner is welcomed like royalty.',
    culturalElement: 'मेहमाननवाज़ी (Indian Hospitality)',
  },
];

export const EXPERIENCE_PILLARS: ExperiencePillar[] = [
  {
    id: 'garden-poolside',
    title: 'GARDEN & POOLSIDE',
    hindiTitle: 'बग़ीचा एवं जलधारा',
    tagline: 'Sprawling open-air seating under the evening sky.',
    description:
      'Dine amidst lush greenery, gently illuminated poolside cabanas, fresh evening breeze, and live instrumental melodies that make every dinner feel like a royal holiday.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
    highlights: [
      'Open-air garden dining with family gazebos',
      'Illuminated poolside tables for intimate romantic evenings',
      'Live music and ghazal sessions on weekend nights',
      'Dedicated children’s play area & expansive lawns',
    ],
  },
  {
    id: 'flavour',
    title: 'PURE VEG CULINARY ART',
    hindiTitle: 'शुद्ध स्वाद',
    tagline: 'From buttery clay rotis to rich royal paneer gravies.',
    description:
      'Our master chefs craft hearty North Indian curries, sizzler plates, authentic tandoori soya chaap, and Indo-Chinese favorites using unadulterated pure spices and fresh desi ghee.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1400&q=80',
    highlights: [
      'Authentic clay tandoors reaching blistering heat for crisp rotis & naans',
      'Specialty Jowar Roti, Missi Roti & Tandoori Butter Rotis',
      'House specialties: Paneer Lababdar, Paneer Rara & Kaju Paneer',
      'Custom Jain menu options prepared with zero onion and zero garlic',
    ],
  },
  {
    id: 'celebrations',
    title: 'CELEBRATIONS & BANQUETS',
    hindiTitle: 'उत्सव व मिलन',
    tagline: 'Memorable birthday parties, anniversaries, and family get-togethers.',
    description:
      'With spacious air-conditioned indoor halls and magnificent outdoor lawns on Indore Bypass, Panjtara is the premier choice for memorable family gatherings, kitty parties, and corporate dinners.',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=80',
    highlights: [
      'Expansive event lawns accommodating up to 500 guests',
      'Complimentary valet parking and easy Bypass Road access',
      'Customizable banquet menus and live chaat/tandoor counters',
      'Warm, attentive service team dedicated to your celebration',
    ],
  },
];
