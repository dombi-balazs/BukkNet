import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-page-nature',
  imports: [TranslatePipe],
  templateUrl: './nature.component.html',
})
export class NaturePage {
}