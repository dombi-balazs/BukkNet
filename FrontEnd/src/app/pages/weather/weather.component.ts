import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-page-weather',
  imports: [TranslatePipe],
  templateUrl: './weather.component.html',
})
export class WeatherPage {
}