import { HostBinding, Injectable, Input } from '@angular/core'
import { ControlValueAccessor } from '@angular/forms'

@Injectable()
export class ControlAccessor implements ControlValueAccessor {
  protected _value: any
  public get value(): any {
    return this._value
  }
  @Input()
  @HostBinding('attr.value')
  public set value(value: any) {
    this._value = value
  }

  protected _disabled: boolean

  onChange = () => {}
  onTouched = () => {}

  writeValue(obj: any): void {
    this.value = obj
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled
  }
}
