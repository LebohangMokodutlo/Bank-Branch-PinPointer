using BankBranchPinPointer.Api.Data;
using BankBranchPinPointer.Api.Models;

namespace BankBranchPinPointer.Api.Tests.Data;

public class MockDataSeederTests
{
    [Fact]
    public void GenerateBranches_ReturnsExpectedCount()
    {
        var branches = MockDataSeeder.GenerateBranches();

        Assert.Equal(MockDataSeeder.BranchCount, branches.Count);
    }

    [Fact]
    public void GenerateBranches_EveryCoordinateIsWithinTheSouthAfricaBoundingBox()
    {
        var branches = MockDataSeeder.GenerateBranches();

        Assert.All(branches, branch =>
        {
            Assert.InRange(branch.Latitude, SouthAfricaBoundingBox.MinLatitude, SouthAfricaBoundingBox.MaxLatitude);
            Assert.InRange(branch.Longitude, SouthAfricaBoundingBox.MinLongitude, SouthAfricaBoundingBox.MaxLongitude);
        });
    }

    [Fact]
    public void GenerateBranches_IsDeterministicAcrossCalls()
    {
        var first = MockDataSeeder.GenerateBranches();
        var second = MockDataSeeder.GenerateBranches();

        Assert.Equal(first.Select(b => b.Id), second.Select(b => b.Id));
        Assert.Equal(first.Select(b => (b.Latitude, b.Longitude)), second.Select(b => (b.Latitude, b.Longitude)));
    }

    [Fact]
    public void GenerateBranches_GautengAndWesternCapeTogetherHoldTheMajorityOfBranches()
    {
        var branches = MockDataSeeder.GenerateBranches();

        var majorityCount = branches.Count(b =>
            b.Address.Province == Models.Province.Gauteng || b.Address.Province == Models.Province.WesternCape);

        // Hub weighting is skewed towards these two provinces (~62% of total weight), so they
        // should clearly dominate the generated dataset without the other 7 provinces being empty.
        Assert.True(majorityCount > branches.Count / 2);
        Assert.True(branches.Select(b => b.Address.Province).Distinct().Count() == Enum.GetValues<Models.Province>().Length);
    }

    [Fact]
    public void GenerateBranches_EveryServicesListIncludesAtm()
    {
        var branches = MockDataSeeder.GenerateBranches();

        Assert.All(branches, branch => Assert.Contains("ATM", branch.Services));
    }

    [Fact]
    public void GenerateBranches_AtmOnlyBranchesHaveNoStaffedServices()
    {
        var branches = MockDataSeeder.GenerateBranches();

        Assert.All(
            branches.Where(branch => branch.Type == BranchType.Atm),
            branch => Assert.Equal(new[] { "ATM" }, branch.Services));
    }

    [Fact]
    public void GenerateBranches_StaffedBranchesHaveAtLeastTwoStaffedServices()
    {
        var branches = MockDataSeeder.GenerateBranches();

        Assert.All(
            branches.Where(branch => branch.Type == BranchType.Branch),
            branch => Assert.True(branch.Services.Count >= 3)); // ATM + at least 2 staffed services
    }

    [Fact]
    public void GenerateBranches_ContainsBothBranchAndAtmTypes()
    {
        var branches = MockDataSeeder.GenerateBranches();

        Assert.Contains(branches, b => b.Type == BranchType.Branch);
        Assert.Contains(branches, b => b.Type == BranchType.Atm);
    }

    [Fact]
    public void GenerateBranches_EveryBranchIsCapitec()
    {
        var branches = MockDataSeeder.GenerateBranches();

        Assert.All(branches, branch => Assert.Equal("Capitec Bank", branch.Bank));
    }
}
