# Bank Branch PinPointer

A learning sandbox for working through React concepts step by step - data fetching (React
Query), component structure, and the built-in hooks (`useState`, `useEffect`, and friends) -
one concept at a time, with each one introduced deliberately rather than inherited from a
template.

## What's here right now

Deliberately just the bare minimum: Vite, React, and ESLint. No router, no data-fetching
library, no map, no business logic. Everything beyond this gets added one step at a time.

```bash
npm install
npm run dev     # http://localhost:5173
npm run lint
npm run build
```

## Planned learning path

Rough order, adjusted as we go:

1. **Data fetching** - starting with a plain `fetch` + `useState`/`useEffect` to see what a
   data-fetching hook has to handle by hand (loading/error state, race conditions, cleanup),
   then introducing **React Query** and comparing what it takes off your plate.
2. **Component structure** - splitting UI into components, props vs. state, lifting state up.
3. **Custom hooks** - extracting reusable logic once a pattern repeats.
4. Further topics as they come up (context, forms, routing, etc.).

No fixed deadline - this is paced around understanding each concept before moving to the next.
