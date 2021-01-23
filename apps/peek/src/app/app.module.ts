import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { WebSocketFacade, WebSocketFactory } from '@peek/core/adapter'
import {
  SharedDataAccessModule,
  SOCKET_CONFIG_TOKEN,
} from '@peek/shared/data-access'
import {
  PeekMaterialModule,
  SharedElementsModule
} from '@peek/shared/elements'
import { MatSidenavModule } from '@angular/material/sidenav'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { ReactiveFormsModule } from '@angular/forms'
import { ServiceWorkerModule } from '@angular/service-worker'
import { MeetComponent } from './meet/meet.component'
import { HomeComponent } from './home/home.component'
import { AppComponent } from './app.component'
import { A11yModule } from '@angular/cdk/a11y'
import { NgModule } from '@angular/core'
import { env } from '../envs/env';
import { FunnyComponent } from './funny/funny.component';
import { VoiceComponent } from './voice/voice.component'

@NgModule({
  declarations: [AppComponent, HomeComponent, MeetComponent, FunnyComponent, VoiceComponent],
  imports: [
    A11yModule,
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    PeekMaterialModule,
    ReactiveFormsModule,
    SharedElementsModule,
    SharedDataAccessModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: env.prod }),
  ],
  providers: [
    { provide: SOCKET_CONFIG_TOKEN, useValue: env.webSocket ?? {} },
    {
      provide: WebSocketFacade,
      useFactory: WebSocketFactory,
      deps: [SOCKET_CONFIG_TOKEN],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
