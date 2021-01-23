import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Component, Inject } from '@angular/core'
import { peekCode } from '@peek/core/model'

export interface ConfirmData<T = any> {
  title: string
  text?: string
  extra?: T
}

@Component({
  templateUrl: './confirm.dialog.html',
  styleUrls: ['./confirm.dialog.scss'],
})
export class ConfirmDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmData) {}
}
