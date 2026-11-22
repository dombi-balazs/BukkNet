using BukkNet.Models;

namespace BukkNet.Services;

public interface IWeatherService
{
    Task<IReadOnlyList<WeatherInformation>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<WeatherInformation?> GetByLocationIdAsync(string locationId, CancellationToken cancellationToken = default);
}