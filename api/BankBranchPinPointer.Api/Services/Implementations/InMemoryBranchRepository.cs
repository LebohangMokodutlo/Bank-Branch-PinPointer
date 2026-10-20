using BankBranchPinPointer.Api.Data;
using BankBranchPinPointer.Api.Models;

namespace BankBranchPinPointer.Api.Services;

/// <summary>
/// Holds the mock branch dataset in memory for the lifetime of the process. Registered as a
/// singleton so the (deterministic, but non-trivial) generation work only ever runs once at
/// startup rather than on every request.
/// </summary>
public class InMemoryBranchRepository : IBranchRepository
{
    private readonly IReadOnlyList<BankBranch> _branches;
    private readonly IReadOnlyDictionary<Guid, BankBranch> _byId;

    public InMemoryBranchRepository()
    {
        _branches = MockDataSeeder.GenerateBranches();
        _byId = _branches.ToDictionary(branch => branch.Id);
    }

    public IReadOnlyList<BankBranch> GetAll() => _branches;

    public BankBranch? GetById(Guid id) => _byId.GetValueOrDefault(id);
}
