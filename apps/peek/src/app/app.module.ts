import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { WebSocketFacade, WebSocketFactory } from '@peek/core/adapter'
import { MatSidenavModule } from '@angular/material/sidenav'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { ReactiveFormsModule } from '@angular/forms'
import { A11yModule } from '@angular/cdk/a11y'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { ServiceWorkerModule } from '@angular/service-worker'
import { CheckComponent } from './check/check.component'
import { MeetComponent } from './meet/meet.component'
import {
  PeekMaterialModule,
  CorePeekModule,
  SOCKET_CONFIG_TOKEN,
} from '@peek/core/peek'
import { env } from '../envs/env'
import { CheckDialog } from './check/check.dialog'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MeetComponent,
    CheckComponent,
    CheckDialog,
  ],
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
