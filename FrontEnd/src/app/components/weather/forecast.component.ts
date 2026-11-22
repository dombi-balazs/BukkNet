import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { DecimalPipe, DatePipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

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

@Component({
  selector: 'app-forecast',
  imports: [DecimalPipe, DatePipe, TranslatePipe],
  templateUrl: './forecast.component.html',
})
export class ForecastComponent {
  private readonly translate = inject(TranslateService);
  private readonly apiBaseUrl = 'http://192.168.100.24:5285/api/weather';

  readonly selectedLocationId = signal<string | null>(null);
  readonly weatherResource = httpResource<WeatherInformation[]>(() => this.apiBaseUrl);
  readonly isLoading = computed(() => this.weatherResource.isLoading());

  readonly filteredItems = computed(() => {
    const items = this.weatherResource.hasValue() ? this.weatherResource.value() : [];
    const selected = this.selectedLocationId();
    return selected ? items.filter((item) => item.locationId === selected) : items;
  });

  reload(): void {
    this.weatherResource.reload();
  }

  formatSymbol(symbolCode: string): string {
    const key = `weather.symbols.${symbolCode}`;
    const translated = this.translate.instant(key);
    return translated !== key ? translated : symbolCode.replaceAll('_', ' ');
  }
}