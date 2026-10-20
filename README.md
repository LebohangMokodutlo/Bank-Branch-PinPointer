# Bank Branch PinPointer

A learning sandbox for working through production-grade React concepts step by step - data
fetching with React Query, component structure, and the built-in hooks - against a real backend,
rather than against mock-in-the-browser data.

- **`api/`** - a .NET 8 API (MVC controllers) serving mocked Capitec Bank branch data and a
  places autocomplete endpoint. Structurally and functionally the same as the
  [Branch-Locator-Map](https://github.com/LebohangMokodutlo/Branch-Locator-Map) project's API.
  See [`api/README.md`](api/README.md). This half is pre-built - it's infrastructure to fetch
  from, not something being learned here.
- **`frontend/`** - a React + Vite single-page app, deliberately kept minimal (just
  Vite/React/ESLint/Tailwind) so each data-fetching/hooks/component concept gets added
  one at a time, with explanation, rather than inherited from a template. See
  [`frontend/README.md`](frontend/README.md) for the learning roadmap.

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
# API
cd api && dotnet test BankBranchPinPointer.Api.Tests/BankBranchPinPointer.Api.Tests.csproj
```

The frontend doesn't have a test runner configured yet - that's one of the concepts to add as
part of the learning path, once there's actual logic worth testing.

## Repository layout

```
api/        .NET 8 API (MVC controllers) - see api/README.md
frontend/   React + Vite SPA, learning sandbox - see frontend/README.md
docker-compose.yml   runs both together for local use
```
