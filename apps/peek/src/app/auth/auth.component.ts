import { FocusMonitor } from '@angular/cdk/a11y'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { AuthFacade } from '@peek/shared/data-access'
import { MatTabChangeEvent } from '@angular/material/tabs'

@Component({
  selector: 'peek-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  error$ = this.authFacade.error$
  form = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      name: new FormControl('', []),
    },
    { updateOn: 'blur' }
  )
  constructor(
    private _focusMonitor: FocusMonitor,
    readonly formBuilder: FormBuilder,
    readonly authFacade: AuthFacade
  ) {}

  get password() {
    return this.form.get('password') as FormControl
  }

  ngOnInit(): void {}

  onTabChange(tab?: MatTabChangeEvent) {
    console.log(tab)
    this.form.reset()
    this.form.updateValueAndValidity()
  }

  onSubmit() {
    console.log(this.form.value)
    if (this.form.valid) {
      this.authFacade.login(this.form.value)
    }
  }
}
