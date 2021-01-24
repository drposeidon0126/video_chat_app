import { FormGroup } from '@angular/forms'
import { Component, Input } from '@angular/core'

@Component({
  selector: 'peek-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  @Input() form: FormGroup
}
