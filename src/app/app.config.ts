import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
export const appConfig: ApplicationConfig = {
  
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(ToastrModule.forRoot({
      toastClass: 'ngx-toastr custom-toast ', // Clase personalizada para el toast
    })), provideAnimationsAsync()
  ]
};
