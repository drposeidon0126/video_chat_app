import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { MeetComponent } from './meet/meet.component'
import { MeetGuard } from './meet/meet.guard'

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        // { path: '', pathMatch: 'full', redirectTo: 'home' },
        {
          path: '',
          component: HomeComponent,
          data: { animation: 'HomePage' },
        },
        {
          path: ':code',
          canActivate: [MeetGuard],
          component: MeetComponent,
          data: { animation: 'MeetPage' },
        },
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
