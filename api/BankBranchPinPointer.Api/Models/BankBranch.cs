namespace BankBranchPinPointer.Api.Models;

/// <summary>
/// A single mocked bank branch location, returned by GET /api/branches.
/// </summary>
public record BankBranch(
    Guid Id,
    string Bank,
    string Name,
    string BranchCode,
    Address Address,
    double Latitude,
    double Longitude,
    string Phone,
    IReadOnlyList<string> Services);
