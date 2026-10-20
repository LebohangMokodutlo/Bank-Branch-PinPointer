using BankBranchPinPointer.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BankBranchPinPointer.Api.Controllers;

[ApiController]
[Route("api/branches")]
public class BranchesController(IBranchRepository branchRepository) : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(branchRepository.GetAll());

    [HttpGet("{id:guid}")]
    public IActionResult GetById(Guid id)
    {
        var branch = branchRepository.GetById(id);
        return branch is not null ? Ok(branch) : NotFound();
    }
}
