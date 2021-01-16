import { PeerCode, afterView, toPeerCode, WithTarget } from '@peek/core/model'
import { coerceBooleanProperty } from '@angular/cdk/coercion'
import { FocusMonitor } from '@angular/cdk/a11y'
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
} from '@angular/core'
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl,
  Validators,
} from '@angular/forms'
import {
  MAT_FORM_FIELD,
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field'
import { Subject } from 'rxjs'
@Component({
  selector: 'peek-peer-code',
  templateUrl: './peer-code.component.html',
  styleUrls: ['./peer-code.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: PeerCodeComponent }],
})
export class PeerCodeComponent
  implements
    ControlValueAccessor,
    MatFormFieldControl<PeerCode>,
    AfterViewInit,
    OnDestroy {
  static nextId = 0
  @ViewChild('timeLow') timeLowInput: HTMLInputElement
  @ViewChild('timeMid') timeMidInput: HTMLInputElement
  @ViewChild('timeHiAndVersion') timeHiAndVersionInput: HTMLInputElement
  @ViewChild('clockSecHiAndRes') clockSecHiAndResInput: HTMLInputElement

  _readOnly = false
  get readOnly() {
    return this._readOnly
  }
  @Input()
  @HostBinding('attr.readOnly')
  set readOnly(v: string | boolean) {
    this._readOnly = v === false ? false : true
  }

  parts: FormGroup
  stateChanges = new Subject<void>()

  private _autofocus = false
  public get autofocus() {
    return this._autofocus
  }
  @Input()
  @HostBinding('attr.autofocus')
  public set autofocus(v: boolean | string) {
    this._autofocus = v === false ? false : true
  }

  focused = false
  controlType = 'control-code-input'

  @HostBinding('attr.id')
  id = `control-code-input-${PeerCodeComponent.nextId++}`

  onChange = (_: any) => {}
  onTouched = () => {}

  get empty() {
    const {
      value: { timeLow, timeMid, timeHiAndVersion, clockSecHiAndRes },
    } = this.parts

    return !timeLow && !timeMid && !timeHiAndVersion && !clockSecHiAndRes
  }

  @HostBinding('class.control-floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty
  }

  @Input('aria-describedby') userAriaDescribedBy: string

  @Input()
  get placeholder(): string {
    return this._placeholder
  }
  set placeholder(value: string) {
    this._placeholder = value
    this.stateChanges.next()
  }
  private _placeholder: string

  @Input()
  get required(): boolean {
    return this._required
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value)
    this.stateChanges.next()
  }
  private _required = false

  @Input()
  get disabled(): boolean {
    return this._disabled
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value)
    this._disabled ? this.parts.disable() : this.parts.enable()
    this.stateChanges.next()
  }
  private _disabled = false

  @Input()
  get value(): PeerCode | null {
    if (this.parts.valid) {
      const {
        value: { timeLow, timeMid, timeHiAndVersion, clockSecHiAndRes },
      } = this.parts
      return new PeerCode(timeLow, timeMid, timeHiAndVersion, clockSecHiAndRes)
    }
    return null
  }
  set value(code: PeerCode | null) {
    const { timeLow, timeMid, timeHiAndVersion, clockSecHiAndRes } =
      code || new PeerCode('', '', '', '')
    this.parts.setValue({
      timeLow,
      timeMid,
      timeHiAndVersion,
      clockSecHiAndRes,
    })
    this.stateChanges.next()
  }

  @HostListener('document:paste', ['$event'])
  onPaste(event: WithTarget<HTMLInputElement>) {
    event.stopPropagation()
    event.preventDefault()
    if ('clipboardData' in event || 'clipboardData' in window) {
      const clipboardData: DataTransfer =
        (event as any).clipboardData || (window as any).clipboardData

      this.ngControl.control.patchValue(
        toPeerCode(clipboardData.getData('Text'))
      )
      event.target.blur()
    }
  }

  get errorState(): boolean {
    return this.parts.invalid && this.parts.dirty
  }

  constructor(
    formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl
  ) {
    this.parts = formBuilder.group({
      timeLow: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern(/^[0-9a-f]{8}$/i),
        ],
      ],
      timeMid: [
        null,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern(/^[0-9a-f]{4}$/i),
        ],
      ],
      timeHiAndVersion: [
        null,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern(/^[0-5][0-9a-f]{3}$/i),
        ],
      ],
      clockSecHiAndRes: [
        null,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern(/^[0-9a-fA-F]{4}/i),
          // Regex
        ],
      ],
    })

    _focusMonitor.monitor(_elementRef, true).subscribe((origin) => {
      if (this.focused && !origin) {
        this.onTouched()
      }
      this.focused = !!origin
      this.stateChanges.next()
    })

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this
    }
  }

  autoFocusNext(
    control: AbstractControl,
    nextElement?: HTMLInputElement
  ): void {
    console.log(control, nextElement);

    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program')
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program')
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete()
    this._focusMonitor.stopMonitoring(this._elementRef)
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement.querySelector(
      '.control-code-input-container'
    )!
    controlElement.setAttribute('aria-describedby', ids.join(' '))
  }

  onContainerClick() {
    console.log('clockSecHiAndRes: ', this.parts.controls.clockSecHiAndRes)
    if (this.parts.controls.clockSecHiAndRes.valid) {
      this._focusMonitor.focusVia(this.clockSecHiAndResInput, 'program')
    } else

    if (this.parts.controls.timeHiAndVersion.valid) {
      this._focusMonitor.focusVia(this.timeHiAndVersionInput, 'program')
    } else if (this.parts.controls.timeMid.valid) {
      this._focusMonitor.focusVia(this.timeHiAndVersionInput, 'program')
    } else if (this.parts.controls.timeLow.valid) {
      this._focusMonitor.focusVia(this.timeMidInput, 'program')
    } else {
      this._focusMonitor.focusVia(this.timeLowInput, 'program')
    }
  }

  writeValue(code: PeerCode | null): void {
    this.value = code
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement)
    this.onChange(this.value)
  }

  ngAfterViewInit() {
    if (this.autofocus) {
      afterView(() => this._focusMonitor.focusVia(this.timeLowInput, 'program'))
    }
  }

  static ngAcceptInputType_disabled: boolean | string | null | undefined
  static ngAcceptInputType_required: boolean | string | null | undefined
}
