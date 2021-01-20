import { navigation } from '../app-navigation'
import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { CheckDialog } from './../check/check.dialog'

@Component({
  selector: 'peek-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  pages = Object.values(navigation)

  constructor(private _dialog: MatDialog) {}

  openCheck() {
    this._dialog.open(CheckDialog)
  }
}
