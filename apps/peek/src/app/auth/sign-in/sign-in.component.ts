import { FormGroup } from '@angular/forms'
import { Component, Input } from '@angular/core'

@Component({
  selector: 'peek-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  @Input() form: FormGroup
}
