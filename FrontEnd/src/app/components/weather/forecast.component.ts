import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { DecimalPipe, DatePipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LocationSelectComponent } from './location-select.component';

export interface ForecastPoint {
  time: string;
  temperatureC: number;
  windSpeedMs: number;
  windFromDirectionDeg: number;
  precipitationMm: number;
  symbolCode: string;
}

export interface WeatherInformation {
  locationId: string;
  locationName: string;
  temperatureC: number;
  windSpeedMs: number;
  windFromDirectionDeg: number;
  precipitationMm: number;
  symbolCode: string;
  updatedAt: string;
  forecast: ForecastPoint[];
}

@Component({
  selector: 'app-forecast',
  imports: [DecimalPipe, DatePipe, TranslatePipe, LocationSelectComponent],
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

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const topAnchor = document.getElementById('mobile-location-jump');
    if (topAnchor) {
      topAnchor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    let parent = topAnchor?.parentElement ?? null;
    while (parent) {
      const style = getComputedStyle(parent);
      const canScrollY =
        (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        parent.scrollHeight > parent.clientHeight;

      if (canScrollY) {
        parent.scrollTo({ top: 0, behavior: 'smooth' });
      }
      parent = parent.parentElement;
    }
  }

  symbolToEmoji(symbolCode: string): string {
    const code = symbolCode.toLowerCase();

    if (code.startsWith('clearsky_night') || code.startsWith('fair_night')) {
      return '🌙';
    }
    if (code.startsWith('clearsky')) {
      return '☀️';
    }
    if (code.startsWith('fair_day') || code.startsWith('partlycloudy')) {
      return '⛅';
    }
    if (code.startsWith('cloudy')) {
      return '☁️';
    }
    if (code.includes('fog')) {
      return '🌫️';
    }
    if (code.includes('thunder')) {
      return '⛈️';
    }
    if ((code.includes('snow') && code.includes('rain')) || code.includes('sleet')) {
      return '🌨️';
    }
    if (code.includes('snow')) {
      return '❄️';
    }
    if (code.includes('rain') || code.includes('shower')) {
      return '🌧️';
    }

    return '🌥️';
  }

  onLocationSelect(locationId: string | null): void {
  this.selectedLocationId.set(locationId);

  if (!locationId) {
    return;
  }

  requestAnimationFrame(() => {
    const element = document.getElementById(`weather-card-${locationId}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

}