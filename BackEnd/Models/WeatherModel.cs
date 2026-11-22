namespace BukkNet.Models;

public sealed record WeatherLocation(
    string Id,
    string Name,
    double Latitude,
    double Longitude,
    int AltitudeMeters
);

public sealed record ForecastPoint(
    DateTimeOffset Time,
    double TemperatureC,
    double WindSpeedMs,
    double WindFromDirectionDeg,
    double PrecipitationMm,
    string SymbolCode
);

public sealed record WeatherInformation(
    string LocationId,
    string LocationName,
    double TemperatureC,
    double WindSpeedMs,
    double WindFromDirectionDeg,
    double PrecipitationMm,
    string SymbolCode,
    DateTimeOffset UpdatedAt,
    IReadOnlyList<ForecastPoint> Forecast
);