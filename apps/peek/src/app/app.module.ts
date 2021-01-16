import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatSidenavModule } from '@angular/material/sidenav'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { ReactiveFormsModule } from '@angular/forms'
import { A11yModule } from '@angular/cdk/a11y'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { RoomComponent } from './room/room.component'
import { HomeComponent } from './home/home.component'
import { ServiceWorkerModule } from '@angular/service-worker'
import { PeekMaterialModule, CorePeekModule } from '@peek/core/peek'
import { Signaling, Media } from '@peek/core/model'
import {
  MediaFactory,
  MEDIA_CONSTRAINTS,
  SignalingFactory,
  SIGNALING_CLIENT,
} from '@peek/core/peek'
import { env } from '../envs/env';
import { One2oneComponent } from './one2one/one2one.component'

@NgModule({
  declarations: [AppComponent, RoomComponent, HomeComponent, One2oneComponent],
  imports: [
    A11yModule,
    CorePeekModule,
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    PeekMaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: env.prod }),
  ],
  providers: [
    {
      provide: SIGNALING_CLIENT,
      useValue: env.seek,
    },
    {
      provide: Signaling,
      useFactory: SignalingFactory,
      deps: [SIGNALING_CLIENT],
    },
    {
      provide: MEDIA_CONSTRAINTS,
      useValue: env.constraints,
    },
    {
      provide: Media,
      useFactory: MediaFactory,
      deps: [MEDIA_CONSTRAINTS],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
