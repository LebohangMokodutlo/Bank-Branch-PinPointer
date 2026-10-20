using System.Net;
using System.Net.Http.Json;
using BankBranchPinPointer.Api.Data;
using BankBranchPinPointer.Api.Models;
using BankBranchPinPointer.Api.Tests;
using Microsoft.AspNetCore.Mvc.Testing;

namespace BankBranchPinPointer.Api.Tests.Controllers;

public class BranchesControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public BranchesControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetBranches_ReturnsOkWithTheFullMockDataset()
    {
        var response = await _client.GetAsync("/api/branches");
        response.EnsureSuccessStatusCode();

        var branches = await response.Content.ReadFromJsonAsync<List<BankBranch>>(TestJsonOptions.Default);

        Assert.NotNull(branches);
        Assert.Equal(MockDataSeeder.BranchCount, branches!.Count);
    }

    [Fact]
    public async Task GetBranches_EveryBranchIsCapitec()
    {
        var response = await _client.GetAsync("/api/branches");
        response.EnsureSuccessStatusCode();

        var branches = await response.Content.ReadFromJsonAsync<List<BankBranch>>(TestJsonOptions.Default);

        Assert.All(branches!, branch => Assert.Equal("Capitec Bank", branch.Bank));
    }

    [Fact]
    public async Task GetBranchById_WithKnownId_ReturnsThatBranch()
    {
        var all = await (await _client.GetAsync("/api/branches")).Content.ReadFromJsonAsync<List<BankBranch>>(TestJsonOptions.Default);
        var existingId = all!.First().Id;

        var response = await _client.GetAsync($"/api/branches/{existingId}");
        response.EnsureSuccessStatusCode();

        var branch = await response.Content.ReadFromJsonAsync<BankBranch>(TestJsonOptions.Default);
        Assert.Equal(existingId, branch!.Id);
    }

    [Fact]
    public async Task GetBranchById_WithUnknownId_ReturnsNotFound()
    {
        var response = await _client.GetAsync($"/api/branches/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
