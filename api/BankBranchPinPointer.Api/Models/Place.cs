namespace BankBranchPinPointer.Api.Models;

/// <summary>
/// A searchable place (city, suburb or landmark) returned by the places autocomplete endpoint.
/// </summary>
public record Place(
    Guid Id,
    string Name,
    string Type,
    Province Province,
    double Latitude,
    double Longitude);
