import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-page-contact',
  imports: [TranslatePipe],
  templateUrl: './contact.component.html',
})
export class ContactPage {
}