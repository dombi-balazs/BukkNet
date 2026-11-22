import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-home',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './home.component.html',
})
export class HomePage {
}