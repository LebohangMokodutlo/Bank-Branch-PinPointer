using BankBranchPinPointer.Api.Models;

namespace BankBranchPinPointer.Api.Services;

public interface IBranchRepository
{
    IReadOnlyList<BankBranch> GetAll();

    BankBranch? GetById(Guid id);
}
