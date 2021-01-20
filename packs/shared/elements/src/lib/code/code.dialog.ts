import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { MatTooltip } from '@angular/material/tooltip'
import { after, PeekCode } from '@peek/core/model'
import { Platform } from '@angular/cdk/platform'

@Component({
  templateUrl: './code.dialog.html',
  styleUrls: ['./code.dialog.scss'],
})
export class PeekCodeDialog implements OnInit {
  url = `https://peek.contact/${this.data}`
  // [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
  key = new FormControl('', [
    Validators.required,
    Validators.pattern(
      /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}/
    ),
  ])

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PeekCode,
    private _ref: MatDialogRef<PeekCodeDialog>,
    private _platform: Platform
  ) {}

  ngOnInit(): void {
    this.key.setValue(this.data)
  }

  onCopy(toolTip: MatTooltip) {
    toolTip.show()
    after(() => toolTip.hide(), 2000)
  }

  onShare() {
    const text = 'Aqui está a chave da nossa reunião\n'
    // this._ref.close(this.data)
    window.open(
      (this._platform.isBrowser
        ? 'https://api.whatsapp.com/send?text='
        : 'whatsapp://send?text=') + encodeURIComponent(text + '\n' + this.url)
    )
  }
}
