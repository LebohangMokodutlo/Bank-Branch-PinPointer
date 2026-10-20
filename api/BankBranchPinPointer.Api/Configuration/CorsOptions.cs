namespace BankBranchPinPointer.Api.Configuration;

/// <summary>
/// Bound from the "Cors" section of appsettings so the allowed frontend origin(s) can differ
/// between local development and the docker-compose/production environment without a code change.
/// </summary>
public class CorsOptions
{
    public const string SectionName = "Cors";

    public string[] AllowedOrigins { get; set; } = Array.Empty<string>();
}
