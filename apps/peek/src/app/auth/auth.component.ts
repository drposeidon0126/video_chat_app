import { FocusMonitor } from '@angular/cdk/a11y';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { AuthFacade } from '@peek/shared/data-access'

@Component({
  selector: 'peek-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  error$ = this.authFacade.error$
  form = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
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
}
