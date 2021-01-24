import { IdentityStorage } from '@peek/shared/data-access'
import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'peek-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() title: string
  constructor(readonly identity: IdentityStorage) {
    // if (!identity.getStoredValue()) {
    //   const random = Math.floor(Math.random() * 9999)
    //   const user = new Identity(uuid(), `Peek-${random}`)
    //   this.identity.store(user)
    // }
  }

  ngOnInit(): void {}
}
