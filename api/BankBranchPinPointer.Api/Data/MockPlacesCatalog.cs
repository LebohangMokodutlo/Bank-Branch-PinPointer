using BankBranchPinPointer.Api.Models;

namespace BankBranchPinPointer.Api.Data;

/// <summary>
/// Builds the places catalog used by the autocomplete endpoint directly from <see cref="SeedHubs"/>,
/// so searching for a place (e.g. "Sandton") lines up with where mock branches were actually generated.
/// </summary>
public static class MockPlacesCatalog
{
    private const int RandomSeed = 7;

    public static IReadOnlyList<Place> GeneratePlaces()
    {
        var random = new Random(RandomSeed);

        return SeedHubs.All
            .Select(hub => new Place(
                Id: NextGuid(random),
                Name: hub.Name,
                Type: hub.Type,
                Province: hub.Province,
                Latitude: hub.Latitude,
                Longitude: hub.Longitude))
            .ToList();
    }

    private static Guid NextGuid(Random random)
    {
        var bytes = new byte[16];
        random.NextBytes(bytes);
        return new Guid(bytes);
    }
}
