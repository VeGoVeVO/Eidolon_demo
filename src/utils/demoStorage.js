import {
  SAMPLE_CLOTHING,
  SAMPLE_OUTFITS,
  SAMPLE_PAYMENTS,
  SAMPLE_SUBSCRIPTION,
  SAMPLE_USAGE,
  SAMPLE_USAGE_TIMELINE,
  SAMPLE_MARKETPLACE,
  SAMPLE_OUTFIT_STATS,
} from './demoData';

const STORAGE_KEYS = {
  CLOTHING: 'demo::clothing',
  OUTFITS: 'demo::outfits',
  USAGE: 'demo::usage',
  SUBSCRIPTION: 'demo::subscription',
  PAYMENTS: 'demo::payments',
  MARKETPLACE: 'demo::marketplace',
  OUTFIT_STATS: 'demo::outfitStats',
};

const isBrowser = typeof window !== 'undefined';

const readJson = (key, fallback) => {
  if (!isBrowser) return structuredClone(fallback);
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return structuredClone(fallback);
    const parsed = JSON.parse(raw);
    return Array.isArray(fallback) ? (Array.isArray(parsed) ? parsed : structuredClone(fallback)) : (parsed ?? structuredClone(fallback));
  } catch (error) {
    console.warn(`Failed to read demo data for ${key}:`, error);
    return structuredClone(fallback);
  }
};

const writeJson = (key, value) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to persist demo data for ${key}:`, error);
  }
};

export const seedDemoData = () => {
  if (!isBrowser) return;
  if (!window.localStorage.getItem(STORAGE_KEYS.CLOTHING)) {
    writeJson(STORAGE_KEYS.CLOTHING, SAMPLE_CLOTHING);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.OUTFITS)) {
    writeJson(STORAGE_KEYS.OUTFITS, SAMPLE_OUTFITS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.USAGE)) {
    writeJson(STORAGE_KEYS.USAGE, SAMPLE_USAGE);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION)) {
    writeJson(STORAGE_KEYS.SUBSCRIPTION, SAMPLE_SUBSCRIPTION);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    writeJson(STORAGE_KEYS.PAYMENTS, SAMPLE_PAYMENTS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.MARKETPLACE)) {
    writeJson(STORAGE_KEYS.MARKETPLACE, SAMPLE_MARKETPLACE);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.OUTFIT_STATS)) {
    writeJson(STORAGE_KEYS.OUTFIT_STATS, SAMPLE_OUTFIT_STATS);
  }
};

export const getDemoClothing = () => readJson(STORAGE_KEYS.CLOTHING, SAMPLE_CLOTHING);
export const saveDemoClothing = (items) => writeJson(STORAGE_KEYS.CLOTHING, items);

export const getDemoOutfits = () => readJson(STORAGE_KEYS.OUTFITS, SAMPLE_OUTFITS);
export const saveDemoOutfits = (items) => writeJson(STORAGE_KEYS.OUTFITS, items);

export const getDemoUsage = () => readJson(STORAGE_KEYS.USAGE, SAMPLE_USAGE);
export const saveDemoUsage = (usage) => writeJson(STORAGE_KEYS.USAGE, usage);

export const getDemoSubscription = () => readJson(STORAGE_KEYS.SUBSCRIPTION, SAMPLE_SUBSCRIPTION);
export const saveDemoSubscription = (subscription) => writeJson(STORAGE_KEYS.SUBSCRIPTION, subscription);

export const getDemoPayments = () => readJson(STORAGE_KEYS.PAYMENTS, SAMPLE_PAYMENTS);
export const saveDemoPayments = (payments) => writeJson(STORAGE_KEYS.PAYMENTS, payments);

export const getDemoMarketplace = () => readJson(STORAGE_KEYS.MARKETPLACE, SAMPLE_MARKETPLACE);
export const saveDemoMarketplace = (items) => writeJson(STORAGE_KEYS.MARKETPLACE, items);

export const getDemoOutfitStats = () => readJson(STORAGE_KEYS.OUTFIT_STATS, SAMPLE_OUTFIT_STATS);
export const saveDemoOutfitStats = (stats) => writeJson(STORAGE_KEYS.OUTFIT_STATS, stats);
