import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-page-trails',
  imports: [TranslatePipe],
  templateUrl: './trails.component.html',
})
export class TrailsPage {
}