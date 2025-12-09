import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // ✅ esta es la correcta para tu versión
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' }) // 👈 esto sigue igual
    )
  ]
};
