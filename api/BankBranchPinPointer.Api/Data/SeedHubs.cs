using BankBranchPinPointer.Api.Models;

namespace BankBranchPinPointer.Api.Data;

/// <summary>
/// Fixed list of real South African cities and suburbs used as the basis for both the mocked
/// bank branches and the places-autocomplete catalog, so a search for e.g. "Sandton" lands the
/// user near branches that were actually generated there.
///
/// Weights are deliberately skewed towards Gauteng (Johannesburg/Pretoria) and the Western Cape
/// (Cape Town and surrounds), per the brief, while every other province still has a wide spread
/// of hubs - down to smaller regional towns - so branches are scattered across the whole country
/// rather than only two provinces or only the biggest cities.
/// </summary>
public static class SeedHubs
{
    public static readonly IReadOnlyList<LocationSeed> All = new List<LocationSeed>
    {
        // Gauteng
        new("Johannesburg CBD", Province.Gauteng, -26.2041, 28.0473, 14, "city"),
        new("Sandton", Province.Gauteng, -26.1076, 28.0567, 12, "suburb"),
        new("Rosebank", Province.Gauteng, -26.1467, 28.0436, 6, "suburb"),
        new("Randburg", Province.Gauteng, -26.0936, 27.9994, 6, "suburb"),
        new("Midrand", Province.Gauteng, -25.9892, 28.1283, 6, "suburb"),
        new("Soweto", Province.Gauteng, -26.2678, 27.8585, 7, "suburb"),
        new("Roodepoort", Province.Gauteng, -26.1625, 27.8727, 5, "suburb"),
        new("Germiston", Province.Gauteng, -26.2309, 28.1753, 5, "suburb"),
        new("Benoni", Province.Gauteng, -26.1883, 28.3206, 4, "suburb"),
        new("Boksburg", Province.Gauteng, -26.2125, 28.2591, 4, "suburb"),
        new("Pretoria CBD", Province.Gauteng, -25.7479, 28.2293, 12, "city"),
        new("Centurion", Province.Gauteng, -25.8603, 28.1894, 7, "suburb"),
        new("Menlyn", Province.Gauteng, -25.7823, 28.2773, 5, "suburb"),
        new("Hatfield", Province.Gauteng, -25.7487, 28.2379, 4, "suburb"),
        new("Sunnyside", Province.Gauteng, -25.7569, 28.1994, 4, "suburb"),
        new("Alberton", Province.Gauteng, -26.2708, 28.1123, 4, "suburb"),
        new("Vereeniging", Province.Gauteng, -26.6731, 27.9319, 3, "city"),
        new("Krugersdorp", Province.Gauteng, -26.0987, 27.7753, 4, "suburb"),
        new("Springs", Province.Gauteng, -26.2528, 28.4383, 3, "suburb"),
        new("Kempton Park", Province.Gauteng, -26.1015, 28.2293, 4, "suburb"),
        new("Soshanguve", Province.Gauteng, -25.5349, 28.1061, 3, "suburb"),
        new("Mamelodi", Province.Gauteng, -25.7072, 28.3718, 4, "suburb"),
        new("Tembisa", Province.Gauteng, -25.9972, 28.2283, 4, "suburb"),
        new("Vanderbijlpark", Province.Gauteng, -26.7110, 27.8362, 3, "suburb"),
        new("Brakpan", Province.Gauteng, -26.2358, 28.3637, 2, "suburb"),
        new("Edenvale", Province.Gauteng, -26.1420, 28.1472, 3, "suburb"),
        new("Diepsloot", Province.Gauteng, -25.9357, 28.0117, 3, "suburb"),
        new("Lenasia", Province.Gauteng, -26.3372, 27.8721, 3, "suburb"),

        // Western Cape
        new("Cape Town CBD", Province.WesternCape, -33.9249, 18.4241, 14, "city", IsCoastal: true),
        // Nudged east from the promenade-adjacent -33.9170, 18.3845 to -33.9153, 18.3925 (closer
        // to Sea Point's actual built-up centre) - the original point sat close enough to the
        // beach that even the coastal jitter radius had its ocean-facing half over water.
        new("Sea Point", Province.WesternCape, -33.9153, 18.3925, 6, "suburb", IsCoastal: true),
        new("Claremont", Province.WesternCape, -33.9808, 18.4647, 5, "suburb"),
        new("Bellville", Province.WesternCape, -33.9000, 18.6292, 6, "suburb"),
        new("Stellenbosch", Province.WesternCape, -33.9321, 18.8602, 6, "suburb"),
        new("Paarl", Province.WesternCape, -33.7342, 18.9621, 5, "suburb"),
        new("Somerset West", Province.WesternCape, -34.0809, 18.8511, 5, "suburb"),
        new("Durbanville", Province.WesternCape, -33.8303, 18.6500, 4, "suburb"),
        new("Milnerton", Province.WesternCape, -33.8847, 18.4964, 4, "suburb", IsCoastal: true),
        new("Khayelitsha", Province.WesternCape, -34.0387, 18.6703, 5, "suburb", IsCoastal: true),
        new("George", Province.WesternCape, -33.9628, 22.4619, 4, "city"),
        new("Mitchells Plain", Province.WesternCape, -34.0392, 18.6133, 5, "suburb", IsCoastal: true),
        new("Worcester", Province.WesternCape, -33.6464, 19.4486, 3, "city"),
        new("Hermanus", Province.WesternCape, -34.4187, 19.2345, 3, "city", IsCoastal: true),
        new("Mossel Bay", Province.WesternCape, -34.1831, 22.1460, 3, "city", IsCoastal: true),
        new("Oudtshoorn", Province.WesternCape, -33.5906, 22.2014, 2, "city"),
        new("Knysna", Province.WesternCape, -34.0363, 23.0471, 2, "city", IsCoastal: true),
        new("Vredenburg", Province.WesternCape, -32.9067, 17.9933, 2, "suburb", IsCoastal: true),
        new("Malmesbury", Province.WesternCape, -33.4608, 18.7322, 2, "suburb"),
        new("Wellington", Province.WesternCape, -33.6392, 19.0111, 2, "suburb"),
        new("Grabouw", Province.WesternCape, -34.1500, 19.0167, 2, "suburb"),
        new("Beaufort West", Province.WesternCape, -32.3567, 22.5811, 2, "city"),
        new("Saldanha", Province.WesternCape, -32.9994, 17.9442, 2, "suburb", IsCoastal: true),

        // KwaZulu-Natal
        new("Durban CBD", Province.KwaZuluNatal, -29.8587, 31.0218, 10, "city", IsCoastal: true),
        new("Umhlanga", Province.KwaZuluNatal, -29.7272, 31.0831, 6, "suburb", IsCoastal: true),
        new("Pinetown", Province.KwaZuluNatal, -29.8149, 30.8707, 4, "suburb"),
        new("Pietermaritzburg", Province.KwaZuluNatal, -29.6006, 30.3794, 5, "city"),
        new("Ballito", Province.KwaZuluNatal, -29.5389, 31.2144, 3, "suburb", IsCoastal: true),
        new("Newcastle", Province.KwaZuluNatal, -27.7580, 29.9307, 3, "city"),
        new("Richards Bay", Province.KwaZuluNatal, -28.7830, 32.0378, 3, "city", IsCoastal: true),
        new("Empangeni", Province.KwaZuluNatal, -28.7542, 31.8936, 2, "suburb"),
        new("Ladysmith", Province.KwaZuluNatal, -28.5583, 29.7812, 2, "city"),
        new("Margate", Province.KwaZuluNatal, -30.8667, 30.3700, 2, "suburb", IsCoastal: true),
        new("Port Shepstone", Province.KwaZuluNatal, -30.7414, 30.4550, 2, "city", IsCoastal: true),
        new("Howick", Province.KwaZuluNatal, -29.4842, 30.1411, 2, "suburb"),
        new("KwaDukuza", Province.KwaZuluNatal, -29.3167, 31.2167, 2, "city", IsCoastal: true),

        // Eastern Cape
        new("Gqeberha", Province.EasternCape, -33.9608, 25.6022, 6, "city", IsCoastal: true),
        new("Uitenhage", Province.EasternCape, -33.7678, 25.3996, 2, "suburb"),
        new("East London", Province.EasternCape, -33.0153, 27.9116, 5, "city", IsCoastal: true),
        new("Mthatha", Province.EasternCape, -31.5889, 28.7844, 3, "city"),
        new("Komani", Province.EasternCape, -31.8976, 26.8753, 2, "city"),
        new("Makhanda", Province.EasternCape, -33.3053, 26.5341, 2, "city"),
        new("King William's Town", Province.EasternCape, -32.8833, 27.3833, 2, "city"),
        new("Jeffreys Bay", Province.EasternCape, -34.0496, 24.9093, 2, "suburb", IsCoastal: true),

        // Free State
        new("Bloemfontein", Province.FreeState, -29.0852, 26.1596, 5, "city"),
        new("Welkom", Province.FreeState, -27.9769, 26.7360, 2, "suburb"),
        new("Sasolburg", Province.FreeState, -26.8146, 27.8172, 3, "suburb"),
        new("Bethlehem", Province.FreeState, -28.2309, 28.3086, 2, "city"),
        new("Kroonstad", Province.FreeState, -27.6505, 27.2340, 2, "city"),
        new("Parys", Province.FreeState, -26.8974, 27.4610, 2, "suburb"),
        new("Phuthaditjhaba", Province.FreeState, -28.5167, 28.8333, 2, "city"),

        // Limpopo
        new("Polokwane", Province.Limpopo, -23.9045, 29.4689, 4, "city"),
        new("Tzaneen", Province.Limpopo, -23.8333, 30.1633, 2, "suburb"),
        new("Thohoyandou", Province.Limpopo, -22.9458, 30.4836, 2, "city"),
        new("Lephalale", Province.Limpopo, -23.6694, 27.7046, 2, "city"),
        new("Mokopane", Province.Limpopo, -24.1917, 29.0113, 2, "city"),
        new("Bela-Bela", Province.Limpopo, -24.8869, 28.2869, 2, "suburb"),

        // Mpumalanga
        new("Mbombela", Province.Mpumalanga, -25.4745, 30.9703, 4, "city"),
        new("eMalahleni", Province.Mpumalanga, -25.8755, 29.2325, 2, "suburb"),
        new("Secunda", Province.Mpumalanga, -26.5167, 29.1667, 3, "city"),
        new("Standerton", Province.Mpumalanga, -26.9333, 29.2500, 2, "suburb"),
        new("Middelburg", Province.Mpumalanga, -25.7756, 29.4642, 3, "city"),
        new("Barberton", Province.Mpumalanga, -25.7914, 31.0531, 2, "suburb"),
        new("Ermelo", Province.Mpumalanga, -26.5333, 29.9833, 2, "city"),

        // North West
        new("Rustenburg", Province.NorthWest, -25.6672, 27.2424, 3, "city"),
        new("Potchefstroom", Province.NorthWest, -26.7145, 27.0980, 2, "suburb"),
        new("Mahikeng", Province.NorthWest, -25.8560, 25.6403, 3, "city"),
        new("Brits", Province.NorthWest, -25.6347, 27.7814, 3, "suburb"),
        new("Klerksdorp", Province.NorthWest, -26.8521, 26.6667, 3, "city"),
        new("Lichtenburg", Province.NorthWest, -26.1500, 26.1667, 2, "city"),

        // Northern Cape
        new("Kimberley", Province.NorthernCape, -28.7282, 24.7499, 3, "city"),
        new("Upington", Province.NorthernCape, -28.4478, 21.2561, 2, "suburb"),
        new("Springbok", Province.NorthernCape, -29.6644, 17.8865, 2, "city"),
        new("De Aar", Province.NorthernCape, -30.6494, 24.0122, 2, "city"),
        new("Postmasburg", Province.NorthernCape, -28.3333, 23.0667, 2, "suburb"),
    };
}
