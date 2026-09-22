export interface SeedMenuItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'starters' | 'tandoor' | 'mains' | 'dal-rice' | 'breads' | 'desserts' | 'beverages';
  price: string;
  description: string;
  dietary: ('jain-available' | 'gluten-free' | 'chef-special')[];
  isSignature?: boolean;
  spiceLevel?: 1 | 2 | 3;
  isAvailable?: boolean;
}

export const INITIAL_MENU_SEED: SeedMenuItem[] = [
  {
    id: 'panjtara-paneer-tikka',
    name: 'Panchtara Paneer Tikka',
    hindiName: 'पञ्चतारा पनीर टिक्का',
    category: 'tandoor',
    price: '₹395',
    description: 'House-made cottage cheese steeped for twelve hours in a five-spice marinade of mustard oil, Kashmiri saffron, and hung yoghurt; charcoal-fired over babool wood.',
    dietary: ['chef-special', 'jain-available'],
    isSignature: true,
    spiceLevel: 2,
    isAvailable: true
  },
  {
    id: 'dal-panjtara',
    name: 'Dal Panchtara',
    hindiName: 'दाल पञ्चतारा',
    category: 'dal-rice',
    price: '₹345',
    description: 'Black lentils slow-simmered for sixteen hours over charcoal embers, finished with churned white butter and mild sun-dried fenugreek.',
    dietary: ['chef-special', 'gluten-free'],
    isSignature: true,
    spiceLevel: 1,
    isAvailable: true
  },
  {
    id: 'subz-dum-biryani',
    name: 'Subz-e-Awadh Dum Biryani',
    hindiName: 'सब्ज़-ए-अवध दम बिरयानी',
    category: 'dal-rice',
    price: '₹425',
    description: 'Aged long-grain basmati layered with garden-harvest vegetables, scented with ittar, saffron, and mint, sealed with whole wheat purdah.',
    dietary: ['jain-available', 'chef-special'],
    isSignature: true,
    spiceLevel: 2,
    isAvailable: true
  },
  {
    id: 'dahi-ke-kebab',
    name: 'Anjeer Dahi Ke Kebab',
    hindiName: 'अंजीर दही के कबाब',
    category: 'starters',
    price: '₹365',
    description: 'Delicate croquettes of hung yoghurt infused with dried Turkish figs and crushed green cardamom, crisp exterior with a melting core.',
    dietary: ['chef-special'],
    isSignature: true,
    spiceLevel: 1,
    isAvailable: true
  },
  {
    id: 'paneer-lababdar',
    name: 'Paneer Lababdar',
    hindiName: 'पनीर लबाबदार',
    category: 'mains',
    price: '₹395',
    description: 'Char-grilled cottage cheese cubes simmered in a luscious gravy of vine-ripened tomatoes, grated paneer, and cashew paste.',
    dietary: ['jain-available'],
    spiceLevel: 2,
    isAvailable: true
  },
  {
    id: 'zafrani-kesar-kheer',
    name: 'Zafrani Kesar Malai Kheer',
    hindiName: 'ज़फ़रानी केसर मलाई खीर',
    category: 'desserts',
    price: '₹225',
    description: 'Slow-reduced organic full cream milk with Govindobhog rice, Persian saffron, and slivered green pistachios served in clay handi.',
    dietary: ['gluten-free', 'chef-special'],
    isSignature: true,
    spiceLevel: 1,
    isAvailable: true
  }
];
