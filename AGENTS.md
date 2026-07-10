# Project Context

## Goal
- Connect all pages to real API hooks, refactor large files into components, eliminate runtime errors and excessive requests.

## Key Constraints
- All `useQuery` hooks must have `staleTime` (2–10 min) to prevent repeated refetching.
- Every feature file must be split into focused components under `features/{section}/{page}/` (max ~150 lines each).
- Auth response format: `{ token, refreshToken, user: { id, username, email, role, avatarUrl, createdAt } }`.
- Error format: `{ message: "..." }` – only check `err?.response?.data?.message`.
- Register role: integer `1` (Customer) / `2` (Artisan) – not string.
- No third-party toast libraries (custom `useToast` only).
- Zustand stores must not reference deleted variables.

## API Base
`http://ammar22.runasp.net/api`

## State
### Completed
- All 9 hook files fixed with `"use client"`, proper imports, mutation signatures, `staleTime`, and query invalidation.
- Auth `role` normalized to lowercase in `useApi.jsx`.
- API paths match Swagger PascalCase controllers (`/Category`, `/Jobs`, `/Offers`, `/Requests`, `/Notifications`, `/Client`).
- All pages connected to real API hooks (Artisan Dashboard, Customer Dashboard, Booking Flow).
- Correct API response shapes established (categories as direct array, auth with `user` wrapper, etc.).
- Zustand `customerStore` cleaned of deleted `defaultServiceCategories` / `mockArtisans` variables.
- **Artisan Dashboard** (395→130 lines) split into 4 components: `StatCards`, `EarningsChart`, `RequestCard`, `RequestList`.
- **Customer Dashboard** (512→75 lines) split into 4 components: `HeroBanner`, `StatusCard`, `RequestList`, `RequestForm`.
- **Artisan Profile** (~280 lines) split into 4 components: `ProfileHeader`, `Portfolio`, `Expertise`, `StatBox`; removed `fallbackArtisan` mock data.
- **Booking Flow** (~296 lines) split into 4 components: `StepIndicator`, `CategorySelect`, `RequestDetails`, `SubmissionSuccess`.
- Replaced `react-hot-toast` with custom `ToastProvider` (`src/hooks/useToast.jsx`).
- `RequestForm.jsx` cleaned of duplicate `lucide-react` imports.
- Build passes successfully.

### Component Locations
- `src/features/artisan/dashboard/` – StatCards, EarningsChart, RequestCard, RequestList
- `src/features/artisan/profile/` – ProfileHeader, Portfolio, Expertise, StatBox
- `src/features/customer/dashboard/` – HeroBanner, StatusCard, RequestList, RequestForm
- `src/features/booking/` – StepIndicator, CategorySelect, RequestDetails, SubmissionSuccess

### staleTime Values
- `useGetCategories` → 10 min + `refetchOnWindowFocus: false`
- `useGetNotifications`, `useGetUnreadNotifications` → 1 min
- All others → 2 min

## Register Payload
```json
{ "userName": "...", "email": "...", "password": "...", "role": 3 }
```
Note: Actual API uses `role: 3` for Client (Customer), `2` for Artisan. Value `1` maps to Admin on the server (NOT Customer). The frontend normalizes "client" → "customer" in `authStorage.js` and `useApi.jsx`.

## Notes
- Build command: `npx next build`
- When adding new pages, always use PascalCase API paths matching Swagger controller names.
- Mutations should use `mutationFn` parameter for dynamic data (never closure).
