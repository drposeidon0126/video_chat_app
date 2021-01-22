import { Component } from '@angular/core'
import { Identity, uuid } from '@peek/core/model'
import { RouterOutlet } from '@angular/router'
import { slideInAnimation } from './app-animations'
import { IdentityStorage } from '@peek/shared/data-access'

@Component({
  selector: 'peek-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation],
})
export class AppComponent {
  title = 'peek'

  constructor(readonly _identity: IdentityStorage) {
    const random = Math.floor(Math.random() * 9999)
    const identity = new Identity(uuid(), `Peek-${random}`)
    this._identity.store(identity)
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet?.activatedRouteData?.animation
  }
}
