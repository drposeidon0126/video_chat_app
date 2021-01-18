import { Component } from '@angular/core'
import { slideInAnimation } from './app-animations'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'peek-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation],
})
export class AppComponent {
  title = 'peek'

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet?.activatedRouteData?.animation
  }
}
