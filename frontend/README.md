# Bank Branch PinPointer - Frontend

A React + Vite single-page app for finding the nearest Capitec Bank branch on a map. Built
feature by feature against the [API](../api/README.md)'s mocked branch data, rather than from a
template - each piece (data fetching, clustering, search, geolocation, admin tooling) was added
deliberately, one concept at a time.

## Tech stack

| Concern | Library |
|---|---|
| UI framework | React 19 |
| Build tool / dev server | Vite |
| Routing | React Router |
| Data fetching | `@tanstack/react-query` |
| Styling | Tailwind CSS v4 (primary color `#2C70EF`) |
| Map | Leaflet + `leaflet.markercluster` (plain JS API, not a React wrapper) |
| Icons | `@mdi/font` (Material Design Icons) |
| Tests | Vitest + React Testing Library |

## Running it

Requires [Node.js](https://nodejs.org/) 22+.

```bash
npm install
cp .env.example .env   # only needed once; adjust VITE_API_BASE_URL if your API isn't on :8080
npm run dev             # http://localhost:5173
```

The [API](../api/README.md) needs to be running too - `cd ../api/BankBranchPinPointer.Api &&
dotnet run --urls http://localhost:8080`, or `docker compose up` from the repo root to run both
together.

Other scripts:

```bash
npm run build       # production build to dist/
npm run preview      # serve that production build locally
npm run lint         # ESLint
npm run test         # Vitest, single run
npm run test:watch   # Vitest, watch mode
```

## Project structure

Feature-first: each area of functionality owns its own `api/`, `hooks/`, `components/`, and
`pages/` folders, rather than grouping everything by file type.

```
src/
  App.jsx            router + the two global providers (admin mode, branch overrides)
  constants.js        shared string constants (route paths, storage keys, query keys, branch types)
  features/
    branches/          the map/locator page - the core of the brief
      api/              getBranches, searchPlaces
      hooks/            useBranches, usePlacesSearch, useNearestBranch, useFilteredBranches
      components/       LeafletMap, PlacesSearch, LocateMeButton, BranchTypeFilter, MapLegend
      constants/        clusterConfig.js (cluster colours/thresholds - shared by the map and legend)
      utils/            escapeHTML, googleMapsDirections
      pages/            BranchesPage
    search-analytics/   admin-only: tracks search demand vs. branch coverage
      hooks/            useSearchDemand
      pages/            SearchAnalyticsPage
    branch-management/  admin-only: view/toggle-active/create-UI demo for branches
      components/       BranchDetailsModal, ToggleActiveConfirmModal, CreateBranchModal
      pages/            ManageBranchesPage
  shared/              cross-cutting code no single feature owns
    components/         NavBar, Modal, RequireAdmin, NotAuthorisedPage
    context/             AdminModeContext, BranchOverridesContext
    hooks/               useDebounce
    lib/                 apiClient.js (the one fetch() wrapper everything else calls)
    services/            searchHistory.js (localStorage-backed search tracking)
    utils/               distance.js (haversine distance - used by both branches and search-analytics)
```

A rule this project follows: a piece of logic starts inside the one feature that needs it; it
only moves to `shared/` once a *second* feature genuinely needs the same thing (that's exactly
what happened to `distance.js` - it started in `features/branches/utils/` and moved once
`search-analytics` needed the same math).

## How each feature works

### Data fetching: `useBranches`

`features/branches/hooks/useBranches.js` wraps React Query's `useQuery` around
`api/getBranches.js`, which calls the one shared `getJson()` helper in `shared/lib/apiClient.js`.
React Query owns the loading/error/data state and caches the result under the `'branches'`
query key (see `constants.js`) - every other hook/page that needs the branch list reads from
that same cache rather than re-fetching.

### The map: `LeafletMap`

Plain, imperative Leaflet (not `react-leaflet`) inside `useRef`/`useEffect` - one effect creates
the map once on mount, a second rebuilds the marker-cluster layer whenever the `branches` prop
changes. Cluster colours/sizes come from `features/branches/constants/clusterConfig.js`, the
same file `MapLegend` reads from, so the two can't drift out of sync. Each marker's popup is
built as an escaped HTML string (`utils/escapeHTML.js`) styled with the same Tailwind classes as
the rest of the app, including a "Get directions" link (`utils/googleMapsDirections.js`) that
opens Google Maps routed from the user's known location, if "Use my location" has been used.

### Search: `PlacesSearch` + `usePlacesSearch`

Debounced (300ms, via `shared/hooks/useDebounce.js`) autocomplete against
`GET /api/places/autocomplete`, via React Query's `enabled` option rather than a manual
early-return-in-effect to skip fetching short queries. Selecting a place updates `selectedPlace`
state in `BranchesPage`; clearing the input resets it to `null`.

### Filtering: `useFilteredBranches`

Two filters apply in a specific order, for a reason: the branch-type filter (All/Branch/ATM)
narrows the dataset *everywhere*, including what counts as "nearest." The location-search filter
only narrows what's *drawn on the map* - searching "Pretoria" shouldn't make "nearest branch to
me" lie about what's actually nearest if you're nowhere near Pretoria. The hook returns both
`typeFiltered` (feeds "nearest branch") and `visibleBranches` (feeds the map) separately so each
consumer gets the right one.

### Geolocation: `LocateMeButton` + `useNearestBranch`

`LocateMeButton` calls `navigator.geolocation.getCurrentPosition` directly inside its click
handler - no `useEffect` involved, since the request is user-triggered, not something to
synchronize with on mount. `useNearestBranch` is **derived state**: it's not stored anywhere,
just recomputed (via `useMemo`) from `userLocation` and the branch list whenever either changes,
using the same haversine distance function (`shared/utils/distance.js`) the location filter
uses. When a nearest branch is found, `LeafletMap` calls Leaflet's `clusterGroup.zoomToShowLayer`
rather than a plain `marker.openPopup()` - that branch's marker might currently be hidden inside
a collapsed cluster, and this handles revealing it before opening the popup.

### Admin mode and route guarding

`shared/context/AdminModeContext.jsx` is a small Context holding one boolean, persisted to
`localStorage` (not just `useState`) specifically so it survives a full page reload - typing a
URL directly into the address bar, unlike clicking a nav link, remounts the whole app from
scratch, which would otherwise reset it. `NavBar` reads it to decide which links to show;
`RequireAdmin` (wrapping the two admin routes in `App.jsx`) reads it to decide whether to render
the real page or `NotAuthorisedPage` - checked the same way regardless of whether the route was
reached by clicking a link or typing the URL. This is client-side-only state, not real
authentication - a UI-level simulation of role-gating, appropriate given everything in this app
is mocked data anyway.

### Deactivating a branch: `BranchOverridesContext`

Toggling a branch's active status in Manage Branches needs to affect the public map too, so that
state can't live locally inside `ManageBranchesPage` - it's lifted into
`shared/context/BranchOverridesContext.jsx` (also `localStorage`-persisted), read by
`BranchesPage` to filter inactive branches out *before* the type filter, the location filter, or
"nearest branch" ever see them. There's no backend endpoint for this - it's a local override
layered on top of the API's data (which always reports every branch as active), not a real
mutation.

### Search Analytics

`shared/services/searchHistory.js` records every place selected in `PlacesSearch` (keyed by
place id, counted, persisted to `localStorage` - this one uses `localStorage` rather than
`sessionStorage` deliberately, since its whole purpose is accumulating evidence of demand across
visits, not just one sitting). `features/search-analytics/hooks/useSearchDemand.js` combines
that history with the live branch list to flag a location as needing more branches once it's
been searched **at least 3 times** and has **fewer than 3 branches within 20km** of it right
now - both named constants in that file if you want to tune them.

To see it in action: on the Branch Locator page, search **Lephalale** three times (reselecting
the same suggestion each time increments its count), then open Search Analytics (admin mode
must be on) - it should show count 3, a low nearby-branch count, and a flagged "needs more
branches." Searching **Sandton** three times instead should never flag, since it's one of the
most densely covered hubs in the dataset.

### Manage Branches

A searchable (`name`/`suburb`), paginated (20 per page) table. Viewing details and toggling
active status are genuinely wired up (the latter through `BranchOverridesContext`, confirmed via
a Cancel/Switch confirmation dialog); creating a branch opens a real form with controlled inputs,
but its submit button is permanently disabled - that one's a UI demonstration only, out of scope
for this brief.

## Testing approach

44 Vitest tests, deliberately scoped to the branch-locator/map feature (the actual brief) rather
than every feature in the app:

- **Pure logic** (`shared/utils/distance.test.js`, `features/branches/utils/escapeHTML.test.js`,
  `.../googleMapsDirections.test.js`) - no React involved, straightforward input/output tests.
- **Hooks** (`useDebounce`, `useNearestBranch`, `useFilteredBranches`, `useBranches`,
  `usePlacesSearch`) - tested via `@testing-library/react`'s `renderHook`, with
  `vi.useFakeTimers()` for anything debounce-related and a fresh `QueryClient` (with
  `retry: false`, since React Query's default 3-retry backoff otherwise blows past a test's
  timeout waiting for an error state) for anything hitting React Query.
- **Components** (`BranchTypeFilter`, `MapLegend`, `LocateMeButton`, `PlacesSearch`) - rendered
  and interacted with via `fireEvent`/`screen`, the same way a user would.

`LeafletMap.jsx` and `BranchesPage.jsx` aren't unit-tested: the former is almost entirely a thin
wrapper around the real Leaflet/`leaflet.markercluster` APIs (mocking them meaningfully would
mostly re-describe the mocks), and the latter is a composition root wiring several hooks
together - both are better verified by running the app than by a unit test with heavy mocking.
