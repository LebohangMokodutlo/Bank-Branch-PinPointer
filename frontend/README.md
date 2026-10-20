# Bank Branch PinPointer - Frontend

A learning sandbox for working through React concepts step by step - data fetching (React
Query), component structure, and the built-in hooks (`useState`, `useEffect`, and friends) -
one concept at a time, with each one introduced deliberately rather than inherited from a
template.

## What's here right now

Vite, React, ESLint, and Tailwind CSS (primary color `#2C70EF`, see `src/index.css`'s `@theme`
block). No router, no data-fetching library, no business logic yet. Everything beyond this gets
added one step at a time.

There's now a real API to fetch from (see [`../api/README.md`](../api/README.md)) - the same
kind of mocked Capitec Bank branch + places-autocomplete data as the production
Branch-Locator-Map project - but nothing in this frontend calls it yet. That's deliberate: the
API existing is infrastructure; writing the `fetch`/React Query code that talks to it is the
first learning step.

```bash
npm install
cp .env.example .env   # only needed once
npm run dev     # http://localhost:5173
npm run lint
npm run build
```

The API needs to be running too for anything you build here to have real data to fetch -
`cd ../api/BankBranchPinPointer.Api && dotnet run --urls http://localhost:8080`, or
`docker compose up` from the repo root to run both together.

## Planned learning path

Rough order, adjusted as we go:

1. **Data fetching** - starting with a plain `fetch` + `useState`/`useEffect` against
   `GET http://localhost:8080/api/branches` to see what a data-fetching hook has to handle by
   hand (loading/error state, race conditions, cleanup), then introducing **React Query** and
   comparing what it takes off your plate.
2. **Component structure** - splitting UI into components, props vs. state, lifting state up.
3. **Custom hooks** - extracting reusable logic once a pattern repeats.
4. Further topics as they come up (context, forms, routing, etc.).

No fixed deadline - this is paced around understanding each concept before moving to the next.
