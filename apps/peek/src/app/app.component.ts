import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { slideInAnimation } from './app-animations'

@Component({
  selector: 'peek-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation],
})
export class AppComponent {
  title = 'peek'
  constructor() {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet?.activatedRouteData?.animation
  }
}
