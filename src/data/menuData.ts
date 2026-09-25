import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // Signatures & Starters
  {
    id: 'dish-1',
    name: 'Tandoori Malai Soya Chaap',
    hindiName: 'तंदूरी मलाई सोया चाप',
    category: 'starters',
    description: 'Tender soya chunks marinated in rich cashew cream, hung curd, cardamom, and roasted in clay oven with bell peppers.',
    price: 340,
    originalPrice: 420,
    isChefSpecial: true,
    spicyLevel: 1,
    tags: ['Clay Tandoor', 'Chef Signature', 'Nut-rich'],
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dish-2',
    name: 'Paneer Angara Tikka',
    hindiName: 'पनीर अंगारा टिक्का',
    category: 'starters',
    description: 'Smoky charcoal-infused cottage cheese cubes steeped in Mathania red chilies, mustard oil, and carom seeds.',
    price: 360,
    originalPrice: 450,
    isChefSpecial: true,
    spicyLevel: 3,
    tags: ['Charcoal Smoked', 'Signature', 'Spicy'],
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dish-3',
    name: 'Dahi Ke Sholay',
    hindiName: 'दही के शोले',
    category: 'starters',
    description: 'Crispy golden bread pockets filled with spiced hung curd, bell peppers, fresh mint, and pomegranate pearls.',
    price: 310,
    originalPrice: 380,
    isChefSpecial: false,
    spicyLevel: 1,
    tags: ['Crispy', 'House Special'],
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dish-4',
    name: 'Bhutte & Cheese Kurkure Kebab',
    hindiName: 'भुट्टे और चीज़ कुरकुरे कबाब',
    category: 'starters',
    description: 'Indori fresh sweet corn mash blended with aged cheddar, green chilies, coated in crushed papad and fried to crisp perfection.',
    price: 320,
    originalPrice: 390,
    isChefSpecial: true,
    spicyLevel: 2,
    tags: ['Indori Sweet Corn', 'Crispy'],
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80'
  },

  // Royal Mains
  {
    id: 'dish-5',
    name: 'Dal Panchtara (Signature Dal Makhani)',
    hindiName: 'दाल पंचतारा',
    category: 'mains',
    description: 'Slow-simmered black lentils and kidney beans cooked for 24 hours over slow wood fire with cultured white butter and fresh cream.',
    price: 380,
    originalPrice: 480,
    isChefSpecial: true,
    spicyLevel: 1,
    tags: ['24-Hour Woodfire', 'Iconic', 'Bestseller'],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dish-6',
    name: 'Paneer Lababdar',
    hindiName: 'पनीर लबाबदार',
    category: 'mains',
    description: 'Soft malai paneer batons simmered in a luscious tomato, onion, and melon seed gravy finished with grated paneer and kasuri methi.',
    price: 410,
    originalPrice: 510,
    isChefSpecial: true,
    spicyLevel: 2,
    tags: ['Rich Gravy', 'Must Try'],
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dish-7',
    name: 'Shahi Kaju Curry (Indori Style)',
    hindiName: 'शाही काजू करी',
    category: 'mains',
    description: 'Golden roasted cashews folded into a velvety spiced onion-tomato gravy subtly spiced with royal cloves and mace.',
    price: 460,
    originalPrice: 560,
    isChefSpecial: true,
    spicyLevel: 2,
    tags: ['Royal Feast', 'Cashew Rich'],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dish-8',
    name: 'Methi Malai Matar Paneer',
    hindiName: 'मेथी मलाई मटर पनीर',
    category: 'mains',
    description: 'Fresh winter fenugreek leaves, green peas, and paneer cubes in a delicate white cashew and cardamom gravy.',
    price: 390,
    originalPrice: 470,
    isChefSpecial: false,
    spicyLevel: 1,
    tags: ['Aromatic', 'Mild & Creamy'],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dish-9',
    name: 'Panchtara Dum Handi Biryani',
    hindiName: 'पंचतारा दम हांडी बिरयानी',
    category: 'mains',
    description: 'Aged Daawat basmati rice layered with garden vegetables, saffron milk, caramelized shallots, sealed with whole wheat dough in earthen handi.',
    price: 420,
    originalPrice: 520,
    isChefSpecial: true,
    spicyLevel: 2,
    tags: ['Clay Handi', 'Saffron Infused', 'Served with Burani Raita'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  },

  // Breads & Rice
  {
    id: 'dish-10',
    name: 'Amritsari Chur Chur Naan',
    hindiName: 'अमृतसरी चूर चूर नान',
    category: 'breads_rice',
    description: 'Multi-layered flaky clay oven bread stuffed with spiced cottage cheese and potatoes, crushed with desi ghee.',
    price: 130,
    originalPrice: 170,
    isChefSpecial: false,
    spicyLevel: 1,
    tags: ['Desi Ghee', 'Flaky'],
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dish-11',
    name: 'Garlic Chilli Butter Naan',
    hindiName: 'गार्लिक चिली बटर नान',
    category: 'breads_rice',
    description: 'Tandoor-baked leavened bread studded with roasted garlic cloves, cilantro, and farm butter.',
    price: 110,
    originalPrice: 140,
    isChefSpecial: false,
    spicyLevel: 2,
    tags: ['Tandoor Fresh'],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
  },

  // Desserts & Royal Beverages
  {
    id: 'dish-12',
    name: 'Indori Shahi Rabdi Jalebi',
    hindiName: 'शाही रबड़ी जलेबी',
    category: 'desserts_beverages',
    description: 'Saffron-soaked crisp golden jalebis served with thick chilled malai rabdi and silver varq.',
    price: 240,
    originalPrice: 300,
    isChefSpecial: true,
    spicyLevel: 1,
    tags: ['Indore Legend', 'Saffron & Pistachio'],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dish-13',
    name: 'Kesar Pista Matka Kulfi',
    hindiName: 'केसर पिस्ता मटका कुल्फी',
    category: 'desserts_beverages',
    description: 'Traditional slow-reduced milk kulfi set in earthen pots with roasted pistachio bits and Kashmiri saffron.',
    price: 180,
    originalPrice: 230,
    isChefSpecial: false,
    spicyLevel: 1,
    tags: ['Earthen Matka', 'Chilled'],
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dish-14',
    name: 'Royal Indori Shikanji (Thick Milk Shake)',
    hindiName: 'रॉयल इंदौरी शिकंजी',
    category: 'desserts_beverages',
    description: 'The famed Sarafa-style thick rabdi drink made with strained yogurt, condensed milk, saffron, and nutmeg.',
    price: 190,
    originalPrice: 240,
    isChefSpecial: true,
    spicyLevel: 1,
    tags: ['Sarafa Legacy', 'Thick & Rich'],
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80'
  }
];
