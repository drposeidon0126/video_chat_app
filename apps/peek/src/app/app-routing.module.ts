import { VoiceComponent } from './voice/voice.component'
import { HomeComponent } from './home/home.component'
import { MeetComponent } from './meet/meet.component'
import { VoiceGuard } from './voice/voice.guard'
import { RouterModule } from '@angular/router'
import { MeetGuard } from './meet/meet.guard'
import { NgModule } from '@angular/core'

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: HomeComponent,
          data: { animation: 'HomePage' },
        },
        {
          path: 'voice/:code',
          canActivate: [VoiceGuard],
          component: VoiceComponent,
          data: { animation: 'VoicePage' },
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
