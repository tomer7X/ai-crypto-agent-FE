## Crypto AI Agent — Frontend

React + TypeScript + Vite application with a glass-morphism dashboard, API integrations, and AI insights.

Built with:
- React 19, TypeScript, Vite
- Material UI (MUI)
- TanStack Query (React Query) for data fetching/caching
- Context for auth token + user preferences


## Quick start

1) Install deps
- npm install

2) Configure backend URL
- Create .env with:
  - VITE_API_BASE_URL=http://localhost:3000

3) Run
- npm run dev

4) Build/preview
- npm run build
- npm run preview


## Environment

Frontend reads the backend base URL from:
- VITE_API_BASE_URL (preferred)

Some API helpers also tolerate VITE_API_BASE as a fallback. If both are absent, some calls will default to http://localhost:3000.


## App flow

Auth and preferences
- Login/Register pages call backend auth endpoints and persist:
  - accessToken (localStorage)
  - TokenExpirationDate (localStorage)
- On app load, if a non-expired token exists, the app fetches user preferences using React Query.
- Routing is controlled by preference availability:
  - No preferences → Onboarding
  - Preferences present → Dashboard

Onboarding
- Select your investor type, favorite coins, and which dashboard sections to show.
- Saves via PUT /api/preferences.
- After save, the app returns to Dashboard and React Query refetches preferences.

Dashboard
- Particles background and a 2x2 glass-morphism layout using a reusable FloatingCard component.
- Cards:
  - Market News: crypto news from backend proxy to CryptoPanic
  - Coins Prices: pricing via backend /api/coins?symbols=… (with a small fallback list if you have no selections yet)
  - AI Insight: calls backend /api/ai/openrouter with a prompt derived from your preferences; shows “Next insight” for a new answer
  - Fun Time: shows a playful image
- “Edit preferences” navigates back to onboarding.
- “Logout” clears localStorage and app state, then reloads the page.

Loading UX
- While data is loading, a polished LoadingDashboard shows skeletons and an animated title.
- Individual cards have their own loading/error/empty states.


## API contracts (expected by the frontend)

Base: ${VITE_API_BASE_URL}

Auth
- POST /auth/register → { token?, user?, ... } (used by RegisterPage)
- POST /auth/login → { token, expiresAt, ... } (LoginPage stores token and expiration)

Preferences
- GET /api/preferences (Authorization: Bearer <token>) → { preferences: { id, userId, currencies: string[], investorType: string, content: string[] } } or 404 if none
- PUT /api/preferences (Authorization: Bearer <token>) body: { currencies: string[], investor_type: string, content: string[] } → updated preferences

News
- GET /api/news/cryptopanic → { source: string, data: { count, next, previous, results: Array<{ id, slug, title, description, published_at, created_at, kind }> } }

Coin prices (backend helper)
- GET /api/coins?symbols=btc,ETH → flexible JSON; frontend normalizes to Record<symbolLower, number>
  - Symbols are case-insensitive; e.g., btc, eth, sol

AI insight
- POST /api/ai/openrouter body: { prompt: string, model?: string = 'openrouter/auto' }
  → { source: 'openrouter', model: string, output: string }

Optional: Coins list (proxy)
- GET /api/coins/coingecko/list?include_platform=false&status=active → [{ id, symbol, name, platforms? }]
  - If this endpoint is missing, the frontend falls back to public CoinGecko /coins/list (rate-limited).


## Project structure (high-level)

- src/
  - App.tsx — app shell, routes by view state (login/register/onboarding/home)
  - context/useUserDataProvider.tsx — auth token + preferences context
  - lib/queryClient.ts — React Query client config
  - hooks/
    - queries.ts — React Query hooks (news, preferences, prices, etc.)
    - useOpenRouter.ts — tiny hook for AI calls
  - api.ts — API client functions (news, preferences, auth, coins, AI)
  - pages/
    - LoginPage, RegisterPage, OnboardingPage, DashboardPage
  - components/
    - FloatingCard — glass-morphism container
    - LoadingDashboard — animated title + skeletons for page-level loading
    - dashboard/ — feature cards: MarketNewsCard, CoinsPricesCard, AiOpenRouterCard, FunTimeCard


## Notes and tips

- React Query Devtools:
  - Removed from production/dev UI. If you want them during development, add ReactQueryDevtools under QueryClientProvider.

- Strict Mode double-invocation (dev only):
  - AiOpenRouterCard dedupes the initial fetch by using a sessionStorage key per prompt to avoid accidental duplicate requests.

- Token persistence:
  - accessToken and TokenExpirationDate are stored in localStorage; expired tokens are cleared on app start.

- Styling:
  - MUI theme values are used inline for simplicity; gradients/shadows are applied per component for a modern look.


## Try it

Development
```
npm install
npm run dev
```

Build
```
npm run build
npm run preview
```

Environment
```
# .env
VITE_API_BASE_URL=http://localhost:3000
```


## Future enhancements
- Persist user session more robustly and add refresh token flow.
- Expand Coins Prices to show 24h change and small sparklines.
- Add settings menu for theme and refresh intervals.
- Integrate a proper router to replace the internal view state when needed.
