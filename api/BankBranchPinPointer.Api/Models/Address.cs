namespace BankBranchPinPointer.Api.Models;

public record Address(
    string Street,
    string Suburb,
    string City,
    Province Province,
    string PostalCode);
