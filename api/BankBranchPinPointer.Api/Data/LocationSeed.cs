using BankBranchPinPointer.Api.Models;

namespace BankBranchPinPointer.Api.Data;

/// <summary>
/// One real South African place used as a "hub" for generating mock branches around it,
/// and also exposed directly through the places autocomplete endpoint.
/// </summary>
/// <param name="Weight">
/// Relative likelihood this hub is chosen when scattering mock branches. Gauteng and Western
/// Cape hubs carry much higher weights so generated branches cluster there, matching real-world
/// bank branch density.
/// </param>
public record LocationSeed(
    string Name,
    Province Province,
    double Latitude,
    double Longitude,
    double Weight,
    string Type);
