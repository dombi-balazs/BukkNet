using System.Globalization;
using System.Text.Json;
using BukkNet.Models;
using Microsoft.Extensions.Caching.Memory;

namespace BukkNet.Services;

public class WeatherService : IWeatherService
{
    private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(4);

    private static readonly List<WeatherLocation> Locations =
    [
        new("miskolc", "Miskolc", 48.1035, 20.7784, 130),
        new("lillafured", "Lillafüred", 48.1019, 20.6147, 320),
        new("szentlelek", "Szentlélek", 48.0789, 20.5036, 560),
        new("bankut", "Bánkút", 48.0836, 20.4614, 920),
        new("nagymezo", "Nagymező", 48.0678, 20.5250, 740),
        new("javorkut", "Jávorkút", 48.0469, 20.5489, 730),
        new("bukkszentlaszlo", "Bükkszentlászló", 48.0819, 20.6514, 580),
        new("bukkszentkereszt", "Bükkszentkereszt", 48.0803, 20.6539, 590),
        new("repashuta", "Répáshuta", 48.0211, 20.5314, 510),
        new("dedestapolcsany", "Dédestapolcsány", 48.1319, 20.4494, 240)
    ];

    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;

    public WeatherService(HttpClient httpClient, IMemoryCache cache)
    {
        _httpClient = httpClient;
        _cache = cache;
    }

    public async Task<IReadOnlyList<WeatherInformation>> GetAllAsync(CancellationToken cancellationToken = default)
{
    var results = new List<WeatherInformation>(Locations.Count);

    foreach (var location in Locations)
    {
        var info = await GetByLocationIdAsync(location.Id, cancellationToken);
        if (info is not null)
        {
            results.Add(info);
        }
    }

    return results;
}

    public async Task<WeatherInformation?> GetByLocationIdAsync(string locationId, CancellationToken cancellationToken = default)
    {
        var location = Locations.FirstOrDefault(
            l => string.Equals(l.Id, locationId, StringComparison.OrdinalIgnoreCase));

        if (location is null)
        {
            return null;
        }

        var cacheKey = $"weather:{location.Id}";
        if (_cache.TryGetValue(cacheKey, out WeatherInformation? cached) && cached is not null)
        {
            return cached;
        }

        var lat = location.Latitude.ToString("0.####", CultureInfo.InvariantCulture);
        var lon = location.Longitude.ToString("0.####", CultureInfo.InvariantCulture);
        var url = $"weatherapi/locationforecast/2.0/compact?lat={lat}&lon={lon}&altitude={location.AltitudeMeters}";

        var response = await _httpClient.GetAsync(url, cancellationToken);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

        var info = MapToWeatherInformation(location, doc.RootElement);
        if (info is not null)
        {
            _cache.Set(cacheKey, info, CacheDuration);
        }

        return info;
    }

    private static WeatherInformation? MapToWeatherInformation(WeatherLocation location, JsonElement root)
    {
        if (!root.TryGetProperty("properties", out var properties) ||
            !properties.TryGetProperty("timeseries", out var timeseries) ||
            timeseries.GetArrayLength() == 0)
        {
            return null;
        }

        var first = timeseries[0];
        var updatedAt = first.TryGetProperty("time", out var timeProp)
            ? timeProp.GetDateTimeOffset()
            : DateTimeOffset.UtcNow;

        if (!first.TryGetProperty("data", out var data) ||
            !data.TryGetProperty("instant", out var instant) ||
            !instant.TryGetProperty("details", out var details))
        {
            return null;
        }

        var temperatureC = details.TryGetProperty("air_temperature", out var temp) ? temp.GetDouble() : 0;
        var windSpeedMs = details.TryGetProperty("wind_speed", out var wind) ? wind.GetDouble() : 0;
        var windDirDeg = details.TryGetProperty("wind_from_direction", out var dir) ? dir.GetDouble() : 0;

        double? precipitationMm = null;
string? symbolCode = null;

foreach (var periodName in new[] { "next_1_hours", "next_6_hours", "next_12_hours" })
{
    if (!data.TryGetProperty(periodName, out var period))
    {
        continue;
    }

    if (symbolCode is null &&
        period.TryGetProperty("summary", out var summary) &&
        summary.TryGetProperty("symbol_code", out var sym) &&
        !string.IsNullOrWhiteSpace(sym.GetString()))
    {
        symbolCode = sym.GetString()!;
    }

    if (precipitationMm is null &&
        period.TryGetProperty("details", out var pDetails) &&
        pDetails.TryGetProperty("precipitation_amount", out var precip) &&
        precip.TryGetDouble(out var parsedPrecip))
    {
        precipitationMm = parsedPrecip;
    }

    if (symbolCode is not null && precipitationMm is not null)
    {
        break;
    }
}

var finalSymbolCode = symbolCode ?? "cloudy";
        var finalPrecipitationMm = precipitationMm ?? 0.0;

        return new WeatherInformation(
            location.Id,
            location.Name,
            temperatureC,
            windSpeedMs,
            windDirDeg,
            finalPrecipitationMm,
            finalSymbolCode,
            updatedAt
        );
    }
}