# Bank Branch PinPointer

A map-based web app for finding the nearest Capitec Bank branch, built against mocked branch
data. Customers can browse branches on a clustered map, search by place, find the branch nearest
their actual location, and filter between full-service branches and standalone ATMs. An
admin-gated section adds a demand-analytics view and a branch-management screen.

- **`api/`** - a .NET 8 API (MVC controllers) serving a deterministic, mocked dataset of ~600
  Capitec Bank branches scattered across South Africa, plus a places-autocomplete endpoint. See
  [`api/README.md`](api/README.md).
- **`frontend/`** - a React + Vite single-page app rendering the branches on a clustered Leaflet
  map. See [`frontend/README.md`](frontend/README.md) for a full walkthrough of each feature and
  how data flows through it.

## Features

- **Clustered map** - ~600 branches grouped into colour-coded clusters (by how many branches
  they contain) that split apart as you zoom, with a legend explaining the colours.
- **Place search** - search a South African city/suburb, pan the map there, and narrow what's
  shown to branches near that place.
- **Find my nearest branch** - uses the browser's Geolocation API to pan/zoom to and highlight
  the closest branch to the user's actual location, with one-click Google Maps directions from
  that exact location.
- **Branch type filter** - toggle between all locations, full-service branches only, or ATMs only
  (applies to the map and to "find my nearest branch" alike).
- **Admin mode** - a nav-bar toggle (persisted in `localStorage`) that reveals two additional
  pages and blocks direct URL access to them when off:
  - **Search Analytics** - tracks which places have been searched and how often, and flags a
    location as potentially under-served once it's been searched a few times but has few
    branches nearby.
  - **Manage Branches** - a searchable, paginated table to view branch details and toggle a
    branch's active status (deactivating one removes it from the public map). Branch creation is
    demonstrated with a full form UI, with the submit action intentionally disabled.

## Tech stack

| Layer | Choice |
|---|---|
| API | .NET 8, MVC controllers, xUnit |
| Frontend | React 19, Vite, React Router, Tailwind CSS |
| Data fetching | `@tanstack/react-query` |
| Map | Leaflet + `leaflet.markercluster` |
| Frontend tests | Vitest + React Testing Library |

## Quick start (Docker)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- API directly (e.g. for Swagger): http://localhost:8080/swagger

## Quick start (without Docker)

In one terminal:

```bash
cd api/BankBranchPinPointer.Api
dotnet run --urls http://localhost:8080
```

In another:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Then open http://localhost:5173.

## Running tests

```bash
# API (18+ xUnit tests)
cd api && dotnet test BankBranchPinPointer.Api.Tests/BankBranchPinPointer.Api.Tests.csproj

# Frontend (44 Vitest tests, scoped to the branch locator/map feature)
cd frontend && npm run test
```

## Manually verifying the app works

1. The map loads centred on South Africa with branches grouped into clusters - denser around
   Johannesburg/Pretoria and Cape Town than elsewhere.
2. Clicking a cluster zooms in; zooming further eventually splits it into individual markers,
   each with a popup showing address, phone, services, and a "Get directions" link.
3. Typing a place name into the search box shows matching suggestions; selecting one pans the
   map there and narrows which branches are shown.
4. The branch-type filter (All / Branches / ATMs) changes what's drawn on the map.
5. "Use my location" (after a browser permission prompt) pans to and highlights the nearest
   branch, respecting whichever type filter is active.
6. Turning on "Admin mode" in the nav bar reveals Search Analytics and Manage Branches; turning
   it off and navigating to either URL directly shows a "Not authorised" page instead.
7. In Manage Branches, toggling a branch to inactive and returning to the map confirms that
   branch no longer appears there.

## Repository layout

```
api/        .NET 8 API (MVC controllers) - see api/README.md
frontend/   React + Vite SPA - see frontend/README.md
docker-compose.yml   runs both together for local use
```
