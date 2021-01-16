import { FormControl, FormGroup, Validators } from '@angular/forms'
import { peerCode } from '@peek/core/model'
import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'peek-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  createForm = new FormGroup(
    {
      name: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9]*$/)]),
    },
    {
      updateOn: 'blur',
    }
  )
  joinForm = new FormGroup(
    {
      code: new FormControl('', []),
    },
    {
      updateOn: 'blur',
    }
  )
  rooms = []
  constructor(private _router: Router) {}

  onCreate() {
    if (this.createForm.valid) {
      const { name } = this.createForm.value
      this._router.navigate(['/', 'room', peerCode()], { state: { name } })
    }
  }

  onJoin() {
    if (this.joinForm.valid) {
      const { code } = this.joinForm.value
      this._router.navigate(['/', 'room', this.joinForm.value])
    }
  }
}
