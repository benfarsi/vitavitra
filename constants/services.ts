export interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  basePrice: number;
  unit: string;
  features: string[];
  category: 'exterior' | 'yard' | 'pool' | 'windows' | 'auto' | 'tech';
  popular?: boolean;
}

export const SERVICES: Service[] = [
  {
    id: 'pressure-washing',
    title: 'Pressure Washing',
    subtitle: 'Siding, driveways, bins, roofs',
    description: 'Professional pressure washing to restore your property to like-new condition. We handle siding, driveways, decks, fences, bins, and rooftops.',
    iconName: 'Droplets',
    basePrice: 149,
    unit: 'starting at',
    features: ['Siding & exterior walls', 'Driveways & walkways', 'Decks & fences', 'Garbage bins', 'Rooftop & gutters'],
    category: 'exterior',
    popular: true,
  },
  {
    id: 'lawn-mowing',
    title: 'Lawn Mowing',
    subtitle: 'Weekly & bi-weekly plans',
    description: 'Keep your lawn looking sharp all season. We offer flexible weekly and bi-weekly mowing plans with edging included.',
    iconName: 'Scissors',
    basePrice: 49,
    unit: 'per cut',
    features: ['Mowing & edging', 'Clipping cleanup', 'Weekly or bi-weekly', 'Seasonal packages', 'Mulching available'],
    category: 'yard',
    popular: true,
  },
  {
    id: 'window-cleaning',
    title: 'Window & Gutter Care',
    subtitle: 'Interior, exterior, tracks, soffits',
    description: 'Crystal clear windows and clean gutters protect your home. We clean all tracks, frames, sills, screens, gutters, and soffits.',
    iconName: 'Sparkles',
    basePrice: 99,
    unit: 'starting at',
    features: ['Interior & exterior glass', 'Tracks, frames & sills', 'Screen cleaning', 'Gutter clearing', 'Soffit cleaning'],
    category: 'windows',
  },
  {
    id: 'pool-cleaning',
    title: 'Pool Care',
    subtitle: 'Opening, maintenance, closing',
    description: 'Full-season pool care including opening, weekly maintenance, chemical balancing, and end-of-season closing.',
    iconName: 'Waves',
    basePrice: 79,
    unit: 'per visit',
    features: ['Pool opening & closing', 'Chemical balancing', 'Skimming & vacuuming', 'Filter cleaning', 'Weekly plans'],
    category: 'pool',
  },
  {
    id: 'garden-care',
    title: 'Garden & Yard Care',
    subtitle: 'Mulching, sodding, garden beds',
    description: 'Complete yard care including mulching, garden bed maintenance, sodding, and seasonal cleanups.',
    iconName: 'Leaf',
    basePrice: 89,
    unit: 'starting at',
    features: ['Mulching & top dressing', 'Garden bed maintenance', 'Sodding', 'Spring/fall cleanup', 'Planting'],
    category: 'yard',
  },
  {
    id: 'auto-detailing',
    title: 'Auto Detailing',
    subtitle: 'Full interior & exterior detail',
    description: 'Professional mobile auto detailing at your home. Full interior vacuuming, wipe-down, exterior wash, and tire dressing.',
    iconName: 'Car',
    basePrice: 120,
    unit: 'starting at',
    features: ['Interior vacuum & wipe', 'Exterior hand wash', 'Window cleaning', 'Tire & rim dressing', 'Odor treatment'],
    category: 'auto',
  },
];

export const COMBO_DEALS = [
  {
    id: 'lawn-detail',
    title: 'Lawn + Car Detail',
    services: ['lawn-mowing', 'auto-detailing'],
    discount: 15,
    description: 'Most popular combo — get your lawn cut and car detailed in one visit.',
  },
  {
    id: 'pressure-windows',
    title: 'Pressure Wash + Windows',
    services: ['pressure-washing', 'window-cleaning'],
    discount: 20,
    description: 'Full exterior refresh — pressure wash the house and clean all windows.',
  },
];
