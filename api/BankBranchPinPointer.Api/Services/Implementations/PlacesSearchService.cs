using BankBranchPinPointer.Api.Data;
using BankBranchPinPointer.Api.Models;

namespace BankBranchPinPointer.Api.Services;

/// <summary>
/// Simple in-memory autocomplete over the mock places catalog: prefix matches are ranked above
/// plain "contains" matches, then results are sorted alphabetically within each group.
/// </summary>
public class PlacesSearchService : IPlacesSearchService
{
    private readonly IReadOnlyList<Place> _places;

    public PlacesSearchService()
    {
        _places = MockPlacesCatalog.GeneratePlaces();
    }

    public IReadOnlyList<Place> Search(string query, int limit)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Array.Empty<Place>();
        }

        var trimmed = query.Trim();

        return _places
            .Where(place => place.Name.Contains(trimmed, StringComparison.OrdinalIgnoreCase))
            .OrderBy(place => place.Name.StartsWith(trimmed, StringComparison.OrdinalIgnoreCase) ? 0 : 1)
            .ThenBy(place => place.Name, StringComparer.OrdinalIgnoreCase)
            .Take(limit)
            .ToList();
    }
}
