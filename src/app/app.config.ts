import { ApplicationConfig } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { ViewDeviceComponent } from './view-device/view-device.component';
import { AddDeviceComponent } from './add-device/add-device.component';

export const routes: Routes = [
  { path: '', component: ViewDeviceComponent },
  { path: 'add-device', component: AddDeviceComponent },
  { path: 'view-devices', component: ViewDeviceComponent },
  { path: 'edit-device/:id', component: AddDeviceComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideHttpClient()]
};
