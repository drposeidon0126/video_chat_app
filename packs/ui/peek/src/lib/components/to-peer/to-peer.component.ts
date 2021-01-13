import { Component, HostBinding, Input } from '@angular/core'

@Component({
  selector: 'peek-to-peer',
  templateUrl: './to-peer.component.html',
  styleUrls: ['./to-peer.component.scss']
})
export class ToPeerComponent  {
  private _active: boolean

  @Input('active')
  public set active(value: boolean) {
    this._active = value
  }

  public get active(): boolean {
    return this._active
  }

  @HostBinding('class.active')
  get isCalling() {
    return this._active
  }
}
