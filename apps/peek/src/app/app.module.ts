import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatSidenavModule } from '@angular/material/sidenav'
import { BrowserModule } from '@angular/platform-browser'
import { ReactiveFormsModule } from '@angular/forms'
import { PeekMaterialModule } from '@peek/ui/peek'
import { AppComponent } from './app.component'
import { NgModule } from '@angular/core'
import { RoomComponent } from './room/room.component'
import { SignalingFactory, SIGNALING_CLIENT } from '@peek/ui/peek'
import { Signaling } from '@peek/core/model'

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
  ],
  imports: [
    BrowserModule,
    MatSidenavModule,
    PeekMaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: SIGNALING_CLIENT,
      useValue: 'http://localhost:3000',
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
