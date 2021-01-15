import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'peek-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  form = new FormGroup(
    {
      code: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9]*$/)]),
    }
  )

  get code() {
    return this.form.get('code') as FormControl
  }

  constructor(private _router: Router) {}

  onEnter() {
    if (this.code.valid) {
      this._router.navigate(['/', 'room', this.code.value])
    }
  }
}
