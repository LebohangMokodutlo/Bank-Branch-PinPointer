namespace BankBranchPinPointer.Api.Data;

/// <summary>
/// The bounding box every generated branch coordinate is clamped into, so mock data never lands
/// outside South Africa even after random jitter is applied around a seed hub.
/// Format: [[minLat, minLng], [maxLat, maxLng]].
/// </summary>
public static class SouthAfricaBoundingBox
{
    public const double MinLatitude = -34.8191663551;
    public const double MinLongitude = 16.3449768409;
    public const double MaxLatitude = -22.0913127581;
    public const double MaxLongitude = 32.830120477;

    public static double ClampLatitude(double latitude) => Math.Clamp(latitude, MinLatitude, MaxLatitude);

    public static double ClampLongitude(double longitude) => Math.Clamp(longitude, MinLongitude, MaxLongitude);
}
