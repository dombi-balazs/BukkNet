import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { WeatherInformation } from './forecast.component';

@Component({
  selector: 'app-location-select',
  imports: [DecimalPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './location-select.component.html',
})
export class LocationSelectComponent {
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  readonly items = input<WeatherInformation[]>([]);
  readonly selectedId = input<string | null>(null);
  readonly symbolEmojiFn = input.required<(symbolCode: string) => string>();
  readonly selectLocation = output<string | null>();

  protected readonly isOpen = signal(false);

  protected readonly selectedItem = computed(() => {
    const id = this.selectedId();
    if (!id) {
      return null;
    }
    return this.items().find((item) => item.locationId === id) ?? null;
  });

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.hostRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  protected toggleMenu(): void {
    this.isOpen.update((open) => !open);
  }

  protected choose(locationId: string | null): void {
    this.selectLocation.emit(locationId);
    this.isOpen.set(false);
  }
}