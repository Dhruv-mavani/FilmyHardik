import { LOGO_SIZES } from './logoSizes';

export const EMAIL = 'filmyyhardik@gmail.com';
export const PHONE_HREF = 'tel:+918733064171';
export const PHONE_TEXT = '+91 87330 64171';

export const SECTIONS = ['top', 'numbers', 'platforms', 'brands', 'contact'];
export const RAIL_LABELS = { top: 'Top', numbers: 'Numbers', platforms: 'Platforms', brands: 'Brands', contact: 'Contact' };

const L = (file) => `/logos/ticker/${file}.webp`;
const SZ = (file) => ({ w: LOGO_SIZES[file][0], h: LOGO_SIZES[file][1] });

export const TICKER_BRANDS = [
  { name: 'Head & Shoulders', logo: L('head-and-shoulders'), ...SZ('head-and-shoulders') },
  { name: 'Red Label Chai', logo: L('red-label-chai'), ...SZ('red-label-chai') },
  { name: 'Rapido', logo: L('rapido'), ...SZ('rapido') },
  { name: 'Mamaearth', logo: L('mamaearth'), ...SZ('mamaearth') },
  { name: 'Jio Hotstar', logo: L('jio-hotstar'), ...SZ('jio-hotstar') },
  { name: 'The Solved Skin', logo: L('the-solved-skin'), ...SZ('the-solved-skin') },
  { name: 'Garnier Men', logo: L('garnier-men'), ...SZ('garnier-men') },
  { name: 'Hajmola', logo: L('hajmola'), ...SZ('hajmola') },
  { name: 'Bigboss Season 18', logo: L('bigboss-season-18'), ...SZ('bigboss-season-18') },
  { name: 'ChatGPT', logo: L('chatgpt'), ...SZ('chatgpt') },
  { name: 'The Bear House', logo: L('the-bear-house'), ...SZ('the-bear-house') },
  { name: 'BruGold Coffee', logo: L('brugold-badge2'), ...SZ('brugold-badge2'), scale: 0.9 },
  { name: 'Atomberg', logo: L('atomberg'), ...SZ('atomberg') },
  { name: 'Loyka', logo: L('loyka'), ...SZ('loyka') },
  { name: 'DTDC Courier', logo: L('dtdc-courier'), ...SZ('dtdc-courier') },
  { name: 'UP Warriorz', logo: L('up-warriorz'), ...SZ('up-warriorz') },
  { name: 'Zouk', logo: L('zouk'), ...SZ('zouk') },
  { name: 'Realme', logo: L('realme'), ...SZ('realme') },
  { name: 'Myntra Creator School', logo: L('myntra-creator-school'), ...SZ('myntra-creator-school') },
];

export const BRAND_BY_NAME = Object.fromEntries(TICKER_BRANDS.map((b) => [b.name, b]));

export const STATS = [
  { to: 350, suffix: 'M+', label: 'Total views', big: true },
  { to: 300, suffix: 'M+', label: 'Views on Instagram' },
  { to: 50, suffix: 'M+', label: 'Views on other platforms' },
  { to: 19, suffix: '', label: 'Brands and events' },
];

export const PLATFORMS = [
  { name: 'Instagram', logo: L('instagram'), num: '50k+', cap: 'Followers', handle: '@filmyhardik', cta: 'Follow', href: 'https://www.instagram.com/filmyhardik/', yel: true },
  { name: 'YouTube', logo: L('youtube'), num: '25k+', cap: 'Subscribers', handle: '@filmyyhardik', cta: 'Subscribe', href: 'https://www.youtube.com/@filmyyhardik' },
  { name: 'Snapchat', logo: L('snapchat'), num: '11k+', cap: 'Followers', handle: '@filmyhardik', cta: 'Add me', href: 'https://www.snapchat.com/@filmyhardik' },
  { name: 'Facebook', logo: L('facebook'), num: 'Reels', cap: 'Page', handle: 'Filmyhardik', cta: 'Follow', href: 'https://www.facebook.com/Filmyhardik/' },
];

export const BRAND_TILES = [
  { size: 'big', w: '100%', eyebrow: 'Biggest one yet', num: '9M+', name: 'Head & Shoulders', desc: 'Views and still counting.' },
  { size: 'mid', w: '91%', eyebrow: 'Chai break, big reach', num: '4M+', name: 'Red Label Chai', desc: 'Views on one campaign.' },
  { size: 'sm', w: '67%', num: '450k+', name: 'Rapido' },
  { size: 'sm', w: '50%', num: '100k+', name: 'Mamaearth' },
  { size: 'sm', w: '50%', num: '100k+', name: 'Jio Hotstar' },
  { size: 'sm', w: '48%', num: '80k+', name: 'The Solved Skin' },
];

export const CHIPS = [
  'Garnier Men', 'Hajmola', 'Bigboss Season 18', 'ChatGPT', 'The Bear House', 'BruGold Coffee',
  'Atomberg', 'Loyka', 'DTDC Courier', 'UP Warriorz', 'Zouk', 'Realme', 'Myntra Creator School',
];

// [short, label, sub, logo]
export const NET_PLATFORMS = [
  ['IG', 'Instagram', '50k+ followers', L('instagram')],
  ['YT', 'YouTube', '25k+ subscribers', L('youtube')],
  ['SC', 'Snapchat', '11k+ followers', L('snapchat')],
  ['FB', 'Facebook', 'Reels page', L('facebook')],
];

// [label, radius, sub]
export const NET_BRANDS = [
  ['Head & Shoulders', 20, '9M+ views'], ['Red Label Chai', 18, '4M+ views'], ['Rapido', 14, '450k+ views'], ['Mamaearth', 11, '100k+ views'],
  ['Jio Hotstar', 11, '100k+ views'], ['The Solved Skin', 10.5, '80k+ views'], ['BruGold Coffee', 10.5, '80k+ views'], ['Hajmola', 10, '70k+ views'],
  ['Atomberg', 10, '70k+ views'], ['Garnier Men', 9, '50k+ views'], ['Bigboss Season 18', 9, '50k+ views'], ['The Bear House', 7.5, '20k+ views'],
  ['Loyka', 7.5, '20k+ views'], ['DTDC Courier', 7.5, '20k+ views'], ['Zouk', 7.5, '20k+ views'], ['ChatGPT', 7, '15k+ story views'],
  ['UP Warriorz', 6.5, 'Event'], ['Realme', 6.5, 'Story'], ['Myntra Creator School', 6.5, 'Event'],
];
