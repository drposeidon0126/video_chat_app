import { CheckDialog, PeekCodeComponent } from '@peek/shared/elements'
import { IdentityStorage } from '@peek/shared/data-access'
import { MatDialog } from '@angular/material/dialog'
import { peekCode } from '@peek/core/model'
import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'peek-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    readonly _dialog: MatDialog,
    readonly _router: Router,
    readonly _identiy: IdentityStorage
  ) {}

  openCheck() {
    this._dialog.open(CheckDialog)
  }

  join() {
    this._dialog.open(PeekCodeComponent, {
      panelClass: 'peek-dialog',
      position: { top: '100px' },
    })
  }

  call() {
    this._router.navigate(['/', 'voice', peekCode()])
  }
}
