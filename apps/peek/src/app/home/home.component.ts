import { CheckDialog, PeekCodeComponent } from '@peek/shared/elements'
import { MatDialog } from '@angular/material/dialog'
import { navigation } from '../app-navigation'
import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'peek-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  pages = Object.values(navigation)

  constructor(readonly _dialog: MatDialog, readonly _router: Router) {}

  openCheck() {
    this._dialog.open(CheckDialog)
  }

  join() {
    this._dialog.open(PeekCodeComponent, { panelClass: 'peek-dialog' })
  }
}
