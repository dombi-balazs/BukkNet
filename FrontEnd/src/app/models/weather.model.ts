export interface WeatherInformation {
  locationId: string;
  locationName: string;
  temperatureC: number;
  windSpeedMs: number;
  windFromDirectionDeg: number;
  precipitationMm: number;
  symbolCode: string;
  updatedAt: string;
}