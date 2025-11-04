const API_BASE = import.meta.env.VITE_API_BASE_URL;

export interface CryptoNewsItem {
  id: number;
  title: string;
  published_at: string;
  url: string;
  source: string;
  currencies?: { code: string; title: string }[];
  votes?: { positive: number; negative: number; important: number };
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
    id: item.id || Date.now(), // Fallback to timestamp if no ID
    title: item.title || 'Untitled',
    published_at: item.published_at || new Date().toISOString(),
    url: item.url || '#',
    source: item.source || 'Unknown Source',
    currencies: Array.isArray(item.currencies) ? item.currencies : [],
    votes: item.votes || { positive: 0, negative: 0, important: 0 }
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