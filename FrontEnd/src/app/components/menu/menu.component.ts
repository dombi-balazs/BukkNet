import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-menu',
  imports: [TranslatePipe],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
}