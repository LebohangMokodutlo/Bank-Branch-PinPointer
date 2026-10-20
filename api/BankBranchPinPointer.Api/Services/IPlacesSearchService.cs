using BankBranchPinPointer.Api.Models;

namespace BankBranchPinPointer.Api.Services;

public interface IPlacesSearchService
{
    IReadOnlyList<Place> Search(string query, int limit);
}
