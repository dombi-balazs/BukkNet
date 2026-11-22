import { Component, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ForecastComponent } from '../../components/weather/forecast.component';

@Component({
  selector: 'app-page-weather',
  imports: [TranslatePipe, ForecastComponent],
  templateUrl: './weather.component.html',
})
export class WeatherPage {
  private readonly forecast = viewChild(ForecastComponent);

  refresh(): void {
    this.forecast()?.reload();
  }
}