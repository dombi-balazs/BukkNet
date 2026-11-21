import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  imports: [TranslatePipe, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  protected readonly isOpen = signal(false);

  protected toggleMenu(): void {
    this.isOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isOpen.set(false);
  }
}