using BankBranchPinPointer.Api.Services;

namespace BankBranchPinPointer.Api.Tests.Services;

public class PlacesSearchServiceTests
{
    private readonly PlacesSearchService _service = new();

    [Fact]
    public void Search_WithBlankQuery_ReturnsNoResults()
    {
        Assert.Empty(_service.Search(string.Empty, 8));
        Assert.Empty(_service.Search("   ", 8));
    }

    [Fact]
    public void Search_IsCaseInsensitive()
    {
        var results = _service.Search("sandton", 8);

        Assert.Contains(results, place => place.Name == "Sandton");
    }

    [Fact]
    public void Search_RanksPrefixMatchesBeforeContainsMatches()
    {
        // "burg" is a plain contains-match substring of "Rustenburg", "Pietermaritzburg" and
        // "Johannesburg CBD" (none of them start with it), so this also proves contains-matching
        // works even when there's no prefix match to rank first.
        var results = _service.Search("burg", 8);

        Assert.True(results.Count >= 2);
        Assert.All(results, place => Assert.Contains("burg", place.Name, StringComparison.OrdinalIgnoreCase));

        // "Ben" is a genuine prefix match ("Benoni") that should rank ahead of any contains-only
        // match further down the alphabet.
        var prefixResults = _service.Search("Ben", 8);
        Assert.Equal("Benoni", prefixResults[0].Name);
    }

    [Fact]
    public void Search_RespectsTheLimit()
    {
        var results = _service.Search("a", 3);

        Assert.True(results.Count <= 3);
    }

    [Fact]
    public void Search_WithNoMatches_ReturnsEmptyList()
    {
        var results = _service.Search("zzzzzznotarealplace", 8);

        Assert.Empty(results);
    }
}
