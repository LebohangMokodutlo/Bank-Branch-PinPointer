using System.Net.Http.Json;
using BankBranchPinPointer.Api.Models;
using BankBranchPinPointer.Api.Tests;
using Microsoft.AspNetCore.Mvc.Testing;

namespace BankBranchPinPointer.Api.Tests.Controllers;

public class PlacesControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public PlacesControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Autocomplete_WithAMatchingQuery_ReturnsMatchingPlaces()
    {
        var response = await _client.GetAsync("/api/places/autocomplete?query=Sandton");
        response.EnsureSuccessStatusCode();

        var places = await response.Content.ReadFromJsonAsync<List<Place>>(TestJsonOptions.Default);

        Assert.NotNull(places);
        Assert.Contains(places!, place => place.Name == "Sandton");
    }

    [Fact]
    public async Task Autocomplete_WithoutAQuery_ReturnsEmptyList()
    {
        var response = await _client.GetAsync("/api/places/autocomplete");
        response.EnsureSuccessStatusCode();

        var places = await response.Content.ReadFromJsonAsync<List<Place>>(TestJsonOptions.Default);

        Assert.NotNull(places);
        Assert.Empty(places!);
    }

    [Fact]
    public async Task Autocomplete_RespectsTheLimitParameter()
    {
        var response = await _client.GetAsync("/api/places/autocomplete?query=a&limit=2");
        response.EnsureSuccessStatusCode();

        var places = await response.Content.ReadFromJsonAsync<List<Place>>(TestJsonOptions.Default);

        Assert.NotNull(places);
        Assert.True(places!.Count <= 2);
    }
}
