import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatSidenavModule } from '@angular/material/sidenav'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { SignalingFactory, SIGNALING_CLIENT } from '@peek/core/peek'
import { PeekMaterialModule, CorePeekModule } from '@peek/core/peek'
import { Signaling } from '@peek/core/model'
import { AppComponent } from './app.component'
import { RoomComponent } from './room/room.component'
import { HomeComponent } from './home/home.component'
import { env } from '../envs/env'
import { Room } from './room/room'

@NgModule({
  declarations: [AppComponent, Room, RoomComponent, HomeComponent],
  imports: [
    CorePeekModule,
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    PeekMaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
