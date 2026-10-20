using System.Text.Json;
using System.Text.Json.Serialization;

namespace BankBranchPinPointer.Api.Tests;

/// <summary>
/// Matches the JSON options the API itself is configured with in Program.cs (camelCase property
/// names, string enum values). <see cref="HttpContentJsonExtensions.ReadFromJsonAsync"/> uses
/// plain/PascalCase defaults unless told otherwise, so tests must pass this explicitly or every
/// property read back would silently come back as its default value.
/// </summary>
public static class TestJsonOptions
{
    public static readonly JsonSerializerOptions Default = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() },
    };
}
