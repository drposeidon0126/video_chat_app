import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { RoomComponent } from './room/room.component'
import { MeetComponent } from './meet/meet.component'
import { CheckComponent } from './check/check.component'

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        { path: '', pathMatch: 'full', redirectTo: 'home' },
        {
          path: 'home',
          component: HomeComponent,
          data: { animation: 'HomePage' },
        },
        {
          path: 'meet',
          component: MeetComponent,
          data: { animation: 'MeetPage' },
        },
        { path: 'check', component: CheckComponent },
        { path: 'room/:code', component: RoomComponent },
      ],
      {
        useHash: true,
        initialNavigation: 'enabled',
        relativeLinkResolution: 'legacy',
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
