using BankBranchPinPointer.Api.Models;

namespace BankBranchPinPointer.Api.Data;

/// <summary>
/// Generates the in-memory mock bank branch dataset. A fixed random seed is used so the
/// generated dataset is identical on every run, making it safe to write assertions against in
/// tests and giving a stable demo experience without having to commit a large generated file.
/// </summary>
public static class MockDataSeeder
{
    // Bumped alongside SeedHubs growing to ~100 real towns/suburbs, so per-hub density (and
    // therefore how clusters look on the map) stays similar to before that list was expanded.
    public const int BranchCount = 600;
    private const int RandomSeed = 42;

    private const string BankName = "Capitec Bank";

    private static readonly string[] AllServices =
    {
        "ATM", "Cash Deposit", "Card Services", "Personal Loans", "Forex", "Account Opening", "Business Banking",
    };

    private static readonly string[] StreetNames =
    {
        "Jan Smuts Avenue", "Oxford Road", "Rivonia Road", "Church Street", "Main Road",
        "Voortrekker Road", "Long Street", "Loop Street", "Bree Street", "Sauer Street",
        "Beyers Naude Drive", "William Nicol Drive", "Nelson Mandela Drive", "Smith Street",
    };

    public static IReadOnlyList<BankBranch> GenerateBranches()
    {
        var random = new Random(RandomSeed);
        var hubs = SeedHubs.All;
        var totalWeight = hubs.Sum(hub => hub.Weight);

        var branches = new List<BankBranch>(BranchCount);
        for (var i = 0; i < BranchCount; i++)
        {
            var hub = PickWeightedHub(hubs, totalWeight, random);
            var (latitude, longitude) = Jitter(hub, random);

            branches.Add(new BankBranch(
                Id: NextGuid(random),
                Bank: BankName,
                Name: $"{BankName} - {hub.Name}",
                BranchCode: random.Next(100000, 999999).ToString(),
                Address: new Address(
                    Street: $"{random.Next(1, 300)} {StreetNames[random.Next(StreetNames.Length)]}",
                    Suburb: hub.Name,
                    City: hub.Name,
                    Province: hub.Province,
                    PostalCode: random.Next(1000, 9999).ToString()),
                Latitude: latitude,
                Longitude: longitude,
                Phone: $"0{random.Next(10, 99)} {random.Next(100, 999)} {random.Next(1000, 9999)}",
                Services: PickServices(random)));
        }

        return branches;
    }

    /// <summary>
    /// Weighted random pick: each hub's chance of being chosen is its Weight divided by the sum
    /// of all weights, which is how Gauteng and Western Cape hubs end up with far more branches.
    /// </summary>
    private static LocationSeed PickWeightedHub(IReadOnlyList<LocationSeed> hubs, double totalWeight, Random random)
    {
        var target = random.NextDouble() * totalWeight;
        var cumulative = 0.0;
        foreach (var hub in hubs)
        {
            cumulative += hub.Weight;
            if (target <= cumulative)
            {
                return hub;
            }
        }

        return hubs[^1];
    }

    /// <summary>
    /// Scatters a point within a small radius of the hub (bigger radius for a "city" hub than a
    /// "suburb" one) so branches around the same hub don't all land on the exact same coordinate,
    /// then clamps the result into the South Africa bounding box as a safety net.
    ///
    /// The radius is deliberately tight (roughly 4km for a city, 2km for a suburb) rather than
    /// the ~13km/~6.6km it originally was: many of our hubs (Cape Town, Durban, Umhlanga,
    /// Hermanus, etc.) are right on the coast, and a wider radius had a real chance of jittering
    /// a branch straight out into the ocean in whatever direction the random angle happened to
    /// point. There's no coastline data here to clip against, so shrinking the radius - which
    /// also means branches stay closer to the suburb they're actually labelled as - is the
    /// practical fix rather than modelling real coastlines for mock data.
    /// </summary>
    private static (double Latitude, double Longitude) Jitter(LocationSeed hub, Random random)
    {
        var maxRadiusDegrees = hub.Type == "city" ? 0.035 : 0.018;
        var angle = random.NextDouble() * 2 * Math.PI;
        var radius = Math.Sqrt(random.NextDouble()) * maxRadiusDegrees;

        var latitude = hub.Latitude + (radius * Math.Sin(angle));
        var longitude = hub.Longitude + (radius * Math.Cos(angle));

        return (SouthAfricaBoundingBox.ClampLatitude(latitude), SouthAfricaBoundingBox.ClampLongitude(longitude));
    }

    private static IReadOnlyList<string> PickServices(Random random)
    {
        var count = random.Next(2, 5);
        return AllServices.OrderBy(_ => random.Next()).Take(count).ToList();
    }

    private static Guid NextGuid(Random random)
    {
        var bytes = new byte[16];
        random.NextBytes(bytes);
        return new Guid(bytes);
    }
}
