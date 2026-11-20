import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader(),
      fallbackLang: 'en',
      lang: 'en'
    }),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);

      translate.addLangs(['en', 'hu']);

      translate.use(
        navigator.language.startsWith('hu')
          ? 'hu'
          : 'en'
      );
    })
  ]
};
