import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'hu' | 'en';

@Component({
  selector: 'app-language',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language.component.html',
})
export class LanguageComponent {
  private readonly translate = inject(TranslateService);
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  private readonly langChange = toSignal(
    this.translate.onLangChange.pipe(
      map((event) => event.lang),
      startWith(this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'en')
    ),
    {
      initialValue:
        this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'en',
    }
  );

  protected readonly isOpen = signal(false);

  protected readonly currentLang = computed<AppLanguage>(() =>
    this.langChange()?.toLowerCase().startsWith('hu') ? 'hu' : 'en'
  );

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.hostRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  protected toggleMenu(): void {
    this.isOpen.update((open) => !open);
  }

  protected selectLanguage(lang: AppLanguage): void {
    this.translate.use(lang);
    this.isOpen.set(false);
  }
}