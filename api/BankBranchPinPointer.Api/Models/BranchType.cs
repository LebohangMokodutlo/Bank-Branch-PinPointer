namespace BankBranchPinPointer.Api.Models;

/// <summary>
/// Whether a location is a full-service staffed branch or just a standalone ATM. Explicit on
/// the model rather than inferred from <see cref="BankBranch.Services"/>, since "does this
/// services list imply a staffed branch?" isn't something a consumer should have to guess at.
/// </summary>
public enum BranchType
{
    Branch,
    Atm,
}
