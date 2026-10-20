using BankBranchPinPointer.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BankBranchPinPointer.Api.Controllers;

[ApiController]
[Route("api/places")]
public class PlacesController(IPlacesSearchService placesSearchService) : ControllerBase
{
    private const int DefaultLimit = 8;
    private const int MaxLimit = 25;

    [HttpGet("autocomplete")]
    public IActionResult Autocomplete([FromQuery] string? query, [FromQuery] int? limit)
    {
        var effectiveLimit = Math.Clamp(limit ?? DefaultLimit, 1, MaxLimit);
        var results = placesSearchService.Search(query ?? string.Empty, effectiveLimit);
        return Ok(results);
    }
}
