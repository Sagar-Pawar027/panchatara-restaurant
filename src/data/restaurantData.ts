export interface MenuItem {
  id: string;
  name: string;
  category: 'mains' | 'starters' | 'biryani' | 'breads' | 'desserts';
  price: number;
  originalPrice?: number;
  description: string;
  spiceLevel: 'Mild' | 'Medium' | 'Rich & Royal';
  isSignature?: boolean;
  image?: string;
  dietary: '100% Pure Veg';
}

import heroDiningImg from '../assets/images/panchtara_hero_dining_1790270753253.jpg';
import dalMakhaniImg from '../assets/images/panchtara_dal_makhani_1790270763946.jpg';
import paneerLababdarImg from '../assets/images/panchtara_paneer_lababdar_1790270776438.jpg';
import royalBiryaniImg from '../assets/images/panchtara_royal_biryani_1790270787695.jpg';

export const RESTAURANT_IMAGES = {
  hero: heroDiningImg,
  dalPanchtara: dalMakhaniImg,
  paneerLababdar: paneerLababdarImg,
  royalBiryani: royalBiryaniImg,
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dal-panchtara',
    name: 'Dal Panchtara Signature',
    category: 'mains',
    price: 360,
    originalPrice: 420,
    description: 'Black lentils slow-cooked overnight over slow charcoal embers with cultured white butter and royal aromatics.',
    spiceLevel: 'Rich & Royal',
    isSignature: true,
    image: dalMakhaniImg,
    dietary: '100% Pure Veg',
  },
  {
    id: 'paneer-lababdar',
    name: 'Shahi Paneer Lababdar',
    category: 'mains',
    price: 395,
    originalPrice: 460,
    description: 'Fresh artisanal cottage cheese cubes tossed in rich heirloom tomato and melon seed gravy, laced with ginger and cream.',
    spiceLevel: 'Medium',
    isSignature: true,
    image: paneerLababdarImg,
    dietary: '100% Pure Veg',
  },
  {
    id: 'dum-biryani',
    name: 'Royal Awadhi Subz Biryani',
    category: 'biryani',
    price: 380,
    originalPrice: 440,
    description: 'Aged long-grain basmati infused with Kashmiri saffron, spiced garden vegetables, mint, and slow dum-sealed in clay.',
    spiceLevel: 'Rich & Royal',
    isSignature: true,
    image: royalBiryaniImg,
    dietary: '100% Pure Veg',
  },
  {
    id: 'dahi-kebab',
    name: 'Anarkali Dahi Ke Kebab',
    category: 'starters',
    price: 320,
    originalPrice: 380,
    description: 'Velvety hung curd medallions delicately infused with crushed cardamom, fresh coriander, and crisp golden crust.',
    spiceLevel: 'Mild',
    isSignature: false,
    dietary: '100% Pure Veg',
  },
  {
    id: 'paneer-tikka',
    name: 'Angaar Paneer Tikka',
    category: 'starters',
    price: 350,
    originalPrice: 410,
    description: 'Stone-ground Mathania chilli and roasted mustard oil marinade, char-grilled to smoky perfection in clay tandoor.',
    spiceLevel: 'Rich & Royal',
    isSignature: false,
    dietary: '100% Pure Veg',
  },
  {
    id: 'kadhai-chaap',
    name: 'Amritsari Kadhai Chaap',
    category: 'mains',
    price: 340,
    originalPrice: 390,
    description: 'Tender soya chaap sautéed in bell peppers, whole pounded coriander seeds, and rustic onion-tomato gravy.',
    spiceLevel: 'Medium',
    isSignature: false,
    dietary: '100% Pure Veg',
  },
  {
    id: 'chur-chur-naan',
    name: 'Amritsari Chur Chur Naan Thali',
    category: 'breads',
    price: 240,
    originalPrice: 280,
    description: 'Crisp flaky tandoori flatbread crushed with desi ghee, served with spiced chole, boondi raita, and pickled onions.',
    spiceLevel: 'Medium',
    isSignature: false,
    dietary: '100% Pure Veg',
  },
  {
    id: 'garlic-butter-naan',
    name: 'Royal Garlic Butter Naan',
    category: 'breads',
    price: 90,
    originalPrice: 110,
    description: 'Fresh tandoor-baked leavened bread encrusted with toasted garlic slivers and brushed with melted clarified butter.',
    spiceLevel: 'Mild',
    isSignature: false,
    dietary: '100% Pure Veg',
  },
  {
    id: 'kesar-phirni',
    name: 'Kashmiri Kesar Phirni',
    category: 'desserts',
    price: 180,
    originalPrice: 220,
    description: 'Silken ground basmati rice pudding infused with saffron, green cardamom, and garnished with slivered pistachios in clay sakora.',
    spiceLevel: 'Mild',
    isSignature: true,
    dietary: '100% Pure Veg',
  },
  {
    id: 'gulab-jamun',
    name: 'Desi Ghee Shahi Jamun (2 pcs)',
    category: 'desserts',
    price: 150,
    originalPrice: 180,
    description: 'Warm melt-in-mouth milk mawa spheres soaked in rose-cardamom saffron syrup, finished with silver vark.',
    spiceLevel: 'Mild',
    isSignature: false,
    dietary: '100% Pure Veg',
  }
];

export const TABLE_AREAS = [
  {
    id: 'royal-gazebo',
    name: 'Royal Gazebo',
    description: 'Intimate outdoor cabana surrounded by tranquil fountains & fragrant night jasmine.',
    capacity: '2 - 6 Guests',
    advanceFee: 500,
  },
  {
    id: 'maharaja-hall',
    name: 'Maharaja Family Hall',
    description: 'Lavish air-conditioned indoor grand dining with hand-carved teakwood seating.',
    capacity: '4 - 14 Guests',
    advanceFee: 800,
  },
  {
    id: 'courtyard-garden',
    name: 'Starlight Courtyard',
    description: 'Open-air courtyard with gentle live instrumental sitar & flute under evening stars.',
    capacity: '2 - 8 Guests',
    advanceFee: 400,
  },
  {
    id: 'candlelight-couple',
    name: 'Private Candlelight Nook',
    description: 'Exclusive couple dining alcove with rose petals, private server, and custom dessert.',
    capacity: '2 Guests Exclusive',
    advanceFee: 600,
  }
];
