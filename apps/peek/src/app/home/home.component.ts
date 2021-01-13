import { RequestPermission } from '@peek/core/usecase';
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'peek-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  permissions: RequestPermission
  constructor() {}
  ngOnInit(): void {
    this.permissions = new RequestPermission()
  }

  async request() {
    const permission = await this.permissions.execute()
    console.log(permission);

  }
}
