const createPlaceholder = (label, background = '#6366F1') => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="640" height="640"><rect width="100%" height="100%" fill="${background}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="48" fill="#FFFFFF" opacity="0.85">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const SAMPLE_USER = {
  id: 'demo-user-001',
  email: 'demo.user@example.com',
  name: 'Demo User',
  picture: createPlaceholder('You', '#10B981'),
};

export const SAMPLE_CLOTHING = [
  {
    clothing_id: 'demo-jacket',
    category: 'outerwear',
    clothing_type: 'jacket',
    description: 'Tailored navy blazer with satin lapels.',
    original_image_url: createPlaceholder('Blazer', '#1E3A8A'),
    processed_image_url: createPlaceholder('Blazer', '#1E40AF'),
    colors: [
      { color: 'Navy', hex: '#1E3A8A', percentage: 70 },
      { color: 'Black', hex: '#111827', percentage: 30 }
    ],
  },
  {
    clothing_id: 'demo-dress',
    category: 'dress',
    clothing_type: 'evening',
    description: 'Silky emerald gown with pleated waistline.',
    original_image_url: createPlaceholder('Dress', '#047857'),
    processed_image_url: createPlaceholder('Dress', '#065F46'),
    colors: [
      { color: 'Emerald', hex: '#047857', percentage: 80 },
      { color: 'Gold', hex: '#FBBF24', percentage: 20 }
    ],
  },
  {
    clothing_id: 'demo-sneaker',
    category: 'shoes',
    clothing_type: 'sneakers',
    description: 'Minimalist white sneakers with gum sole.',
    original_image_url: createPlaceholder('Sneaker', '#F8FAFC'),
    processed_image_url: createPlaceholder('Sneaker', '#E5E7EB'),
    colors: [
      { color: 'White', hex: '#FFFFFF', percentage: 90 },
      { color: 'Gum', hex: '#B45309', percentage: 10 }
    ],
  },
  {
    clothing_id: 'demo-jeans',
    category: 'bottom',
    clothing_type: 'denim',
    description: 'Relaxed fit denim with mid wash.',
    original_image_url: createPlaceholder('Denim', '#1D4ED8'),
    processed_image_url: createPlaceholder('Denim', '#2563EB'),
    colors: [
      { color: 'Indigo', hex: '#1D4ED8', percentage: 100 }
    ],
  }
];

export const SAMPLE_OUTFITS = [
  {
    outfit_id: 'demo-outfit-1',
    title: 'Gallery Opening',
    description: 'Structured blazer over silk blouse with tapered trousers.',
    created_at: new Date().toISOString(),
    original_image: createPlaceholder('Before', '#312E81'),
    result_image: createPlaceholder('After', '#4338CA'),
    result_image_processed: createPlaceholder('After', '#4C1D95'),
  },
  {
    outfit_id: 'demo-outfit-2',
    title: 'Weekend Escape',
    description: 'Relaxed tee tucked into high-waisted denim with sneakers.',
    created_at: new Date().toISOString(),
    original_image: createPlaceholder('Before', '#0F172A'),
    result_image: createPlaceholder('After', '#1E293B'),
    result_image_processed: createPlaceholder('After', '#1D4ED8'),
  },
  {
    outfit_id: 'demo-outfit-3',
    title: 'Evening Gala',
    description: 'Emerald gown with delicate drape and soft lighting.',
    created_at: new Date().toISOString(),
    original_image: createPlaceholder('Before', '#064E3B'),
    result_image: createPlaceholder('After', '#047857'),
    result_image_processed: createPlaceholder('After', '#065F46'),
  }
];

export const SAMPLE_USAGE = {
  uploadsRemaining: 5,
  outfitsRemaining: 8,
  lastResetDate: new Date().toISOString(),
};

export const SAMPLE_SUBSCRIPTION = {
  plan: 'Demo Premium',
  status: 'active',
  renewalDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
};

export const SAMPLE_PAYMENTS = [
  {
    id: 'demo-payment-1',
    amount: 2900,
    currency: 'usd',
    created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'succeeded',
    description: 'Demo subscription renewal',
  }
];

export const SAMPLE_MARKETPLACE = [
  {
    id: 'market-1',
    title: 'Contour Wool Coat',
    price: '$240',
    image: createPlaceholder('Coat', '#7C3AED'),
    tags: ['Outerwear', 'Tailored'],
  },
  {
    id: 'market-2',
    title: 'Sculpt Knit Dress',
    price: '$180',
    image: createPlaceholder('Dress', '#EC4899'),
    tags: ['Evening', 'Silhouette'],
  },
  {
    id: 'market-3',
    title: 'Everyday Leather Tote',
    price: '$210',
    image: createPlaceholder('Tote', '#14B8A6'),
    tags: ['Accessory', 'Leather'],
  }
];

export const SAMPLE_USAGE_TIMELINE = [
  { label: 'Jan', value: 4 },
  { label: 'Feb', value: 7 },
  { label: 'Mar', value: 5 },
  { label: 'Apr', value: 9 },
];

export const SAMPLE_OUTFIT_STATS = {
  favorites: 12,
  recent: 3,
  shared: 5,
};
