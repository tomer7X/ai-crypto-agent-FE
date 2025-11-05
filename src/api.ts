const API_BASE = import.meta.env.VITE_API_BASE_URL;

export interface CryptoNewsItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  published_at: string;
  created_at: string;
  kind: string;
}

export interface CryptoNewsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CryptoNewsItem[];
}

/**
 * Fetch crypto news from the backend cryptopanic endpoint.
 * @returns Promise<CryptoNewsResponse>
 */
export async function fetchCryptoNews(): Promise<CryptoNewsResponse> {
  if (!API_BASE) {
    throw new Error('API_BASE_URL not configured');
  }

  console.log('Fetching news from:', `${API_BASE}/api/news/cryptopanic`);
  
  const res = await fetch(`${API_BASE}/api/news/cryptopanic`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Note: Add Authorization header here once auth is implemented
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('News API error response:', text);
    throw new Error(`Failed to fetch crypto news: ${text}`);
  }

  const data = (await res.json()).data;
  console.log('Raw API response:', data);

  // Validate response structure
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format: not an object');
  }

  const results = data.results;
  if (!Array.isArray(results)) {
    throw new Error('Invalid response format: results is not an array');
  }


  // Map and validate each news item
  const validatedResults = results.map((item: any) => ({
    id: item.id || Date.now(),
    slug: item.slug || '',
    title: item.title || 'Untitled',
    description: item.description || 'No description available',
    published_at: item.published_at || new Date().toISOString(),
    created_at: item.created_at || item.published_at || new Date().toISOString(),
    kind: item.kind || 'news'
  }));

  return {
    count: data.count || validatedResults.length,
    next: data.next || null,
    previous: data.previous || null,
    results: validatedResults
  };
}

/**
 * Get user preferences using JWT token.
 */
export async function getPreferences(token: string) {
  if (!API_BASE) throw new Error("API_BASE_URL not configured");
  const res = await fetch(`${API_BASE}/api/preferences`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 404) return null; // no preferences yet
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get preferences: ${text}`);
  }

  return res.json();
}

/**
 * Create or update user preferences using PUT and JWT token.
 */
export async function putPreferences(token: string, preferences: any) {
  if (!API_BASE) throw new Error("API_BASE_URL not configured");
  const res = await fetch(`${API_BASE}/api/preferences`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(preferences),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to save preferences: ${text}`);
  }

  return res.json();
}

export async function createAccount(fullName: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullName, email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function validateLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
  platforms?: Record<string, string>;
}
export type CoinPricesMap = Record<string, number>; // key: symbol lowercase, value: price in USD (best-effort)

function normalizePriceValue(v: any): number | null {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof v === 'object') {
    if (typeof v.price === 'number') return v.price;
    if (typeof v.price_usd === 'number') return v.price_usd;
    if (typeof v.usd === 'number') return v.usd;
    if (typeof v.value === 'number') return v.value;
  }
  return null;
}

/**
 * Fetch coin prices for a list of symbols via backend: GET /api/coins?symbols=btc,ETH
 * Returns a map of symbol(lowercase) -> price number (USD best-effort).
 */
export async function fetchCoinPrices(symbols: string[]): Promise<CoinPricesMap> {
  if (!API_BASE) throw new Error('API_BASE_URL not configured');
  const unique = Array.from(new Set(symbols.filter(Boolean)));
  if (unique.length === 0) return {};

  const url = new URL(`${API_BASE}/api/coins`);
  url.searchParams.set('symbols', unique.join(','));

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch coin prices: ${text}`);
  }

  const raw = await res.json();

  const out: CoinPricesMap = {};
  const tryAssign = (sym: string, val: any) => {
    const price = normalizePriceValue(val);
    if (price != null) out[sym.toLowerCase()] = price;
  };

  if (Array.isArray(raw)) {
    for (const item of raw) {
      const sym = (item?.symbol ?? item?.ticker ?? '').toString();
      if (!sym) continue;
      tryAssign(sym, item);
    }
  } else if (raw && typeof raw === 'object') {
    const data = (raw as any).data ?? (raw as any).prices ?? raw;
    if (data && typeof data === 'object') {
      for (const [k, v] of Object.entries<any>(data)) {
        tryAssign(k, v);
      }
    }
  }

  return out;
}