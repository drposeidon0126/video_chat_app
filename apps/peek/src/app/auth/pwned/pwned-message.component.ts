import { Component, Input } from '@angular/core'

@Component({
  selector: 'peek-pwned-message',
  templateUrl: './pwned-message.component.html',
  styleUrls: ['./pwned-message.component.scss'],
})
export class PwnedMessageComponent {
  @Input() pwned: number
}
