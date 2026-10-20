# Bank Branch PinPointer API

A .NET 8 API (MVC controllers) that serves two things:

1. **Mocked Capitec Bank branches** - a deterministic, in-memory dataset scattered around real
   South African cities and suburbs, weighted towards Gauteng and the Western Cape. Every branch
   belongs to the same bank (Capitec) by design - this is a single-bank branch locator.
2. **A places autocomplete endpoint** - backed by the same set of real places, used by the
   frontend's search box.

There is no database. Everything is generated once, in memory, when the process starts.

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/branches` | All ~600 mocked Capitec Bank branches. |
| `GET` | `/api/branches/{id}` | A single branch by id, or `404`. |
| `GET` | `/api/places/autocomplete?query=&limit=` | Places matching `query` (case-insensitive, prefix matches ranked first). `limit` defaults to 8, max 25. |
| `GET` | `/health` | Basic health check (used by Docker/orchestration). |
| `GET` | `/swagger` | Interactive API docs (Swagger UI). |

Example:

```bash
curl "http://localhost:8080/api/places/autocomplete?query=sand"
# [{"id":"...","name":"Sandton","type":"suburb","province":"Gauteng","latitude":-26.1076,"longitude":28.0567}]
```

## How the mock data is generated

See [`Data/SeedHubs.cs`](BankBranchPinPointer.Api/Data/SeedHubs.cs) and
[`Data/MockDataSeeder.cs`](BankBranchPinPointer.Api/Data/MockDataSeeder.cs).

- `SeedHubs` is a fixed list of ~100 real South African cities, towns and suburbs (from the
  major metros down to smaller regional towns in every province), each with a **weight**.
  Gauteng (Johannesburg, Pretoria and surrounds) and the Western Cape (Cape Town and surrounds)
  carry much higher weights than the rest, so the generated dataset ends up visibly denser there
  - matching real-world Capitec branch distribution - while every other province still gets a
  wide spread of hubs, so branches are scattered across the whole country rather than only two
  provinces or only the biggest cities.
- `MockDataSeeder.GenerateBranches()` picks a hub at random (weighted by the field above), then
  jitters a point a small distance around it (a city hub gets a slightly larger jitter radius
  than a suburb), then **clamps** the result into the South Africa bounding box
  `[[-34.8191663551, 16.3449768409], [-22.0913127581, 32.830120477]]` as a safety net. Every
  generated branch belongs to `"Capitec Bank"` - there's no multi-bank variation.
- A **fixed random seed (`42`)** drives all of this, so the exact same ~600 branches are
  generated every time the app starts - useful for demos (consistent map) and for the unit tests
  in `BankBranchPinPointer.Api.Tests` (which assert things like "every coordinate is inside the
  bounding box", "Gauteng + Western Cape hold the majority of branches", and "every branch is
  Capitec").
- The same `SeedHubs` list, converted to `Place` records, is what the places autocomplete
  endpoint searches - so searching "Sandton" lands you near branches that were actually generated
  around that exact point.

Both the branch list and the places list are built once and held in memory for the app's
lifetime (`InMemoryBranchRepository` / `PlacesSearchService`, both registered as DI singletons in
[`Program.cs`](BankBranchPinPointer.Api/Program.cs)) - there's no per-request regeneration.

## Running locally

Requires the [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).

```bash
cd BankBranchPinPointer.Api
dotnet run --urls http://localhost:8080
```

Then visit:
- http://localhost:8080/api/branches
- http://localhost:8080/swagger

## Running with Docker

```bash
docker build -f BankBranchPinPointer.Api/Dockerfile -t bank-branch-pinpointer-api .
docker run -p 8080:8080 bank-branch-pinpointer-api
```

(Or just run `docker compose up` from the repository root, which builds and runs both the API
and the frontend together - see the [root README](../README.md).)

## Running the tests

```bash
dotnet test BankBranchPinPointer.Api.Tests/BankBranchPinPointer.Api.Tests.csproj
```

This runs:
- **Unit tests** (`MockDataSeederTests`, `PlacesSearchServiceTests`) against the generation and
  search logic directly.
- **Integration tests** (`BranchesControllerTests`, `PlacesControllerTests`) that spin up the
  whole app in-memory via `WebApplicationFactory<Program>` and hit the real HTTP endpoints.

## Configuration

| Setting | Purpose | Default |
|---|---|---|
| `Cors:AllowedOrigins` (array) | Browser origins allowed to call this API. | `http://localhost:5173`, `http://localhost:4173`, `http://localhost:80` (see `appsettings.json`) |

Override via environment variables (ASP.NET Core's standard convention, double underscore for
nesting), e.g.:

```bash
Cors__AllowedOrigins__0=https://my-deployed-frontend.example.com dotnet run
```

## Project layout

Follows the same conventions as this org's other .NET APIs: real MVC controllers (not Minimal
API endpoint-mapping extensions), and a `Services/` folder with interfaces at its root and their
concrete implementations one level down in `Services/Implementations/`.

```
BankBranchPinPointer.Api/
  Program.cs                      composition root: DI, CORS, MVC, Swagger, health checks
  Controllers/                     BranchesController, PlacesController ([ApiController], [Route], [HttpGet])
  Models/                          plain record types returned as JSON (BankBranch, Place, Address, Province)
  Data/                            SeedHubs (source list), MockDataSeeder, MockPlacesCatalog, bounding box
  Services/
    IBranchRepository.cs           interfaces live at the Services/ root
    IPlacesSearchService.cs
    Implementations/
      InMemoryBranchRepository.cs  concrete implementations live one level down
      PlacesSearchService.cs       (same namespace as their interface - the subfolder is purely
                                     file organisation, not reflected in the namespace)
BankBranchPinPointer.Api.Tests/        xUnit tests, mirroring the source layout above
  Controllers/                     integration tests (WebApplicationFactory<Program>) per controller
  Services/                        unit tests for PlacesSearchService
  Data/                            unit tests for MockDataSeeder
```
