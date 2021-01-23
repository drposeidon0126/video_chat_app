import { Component, OnInit } from '@angular/core'
import { GetDevices } from '@peek/core/usecase'

@Component({
  selector: 'peek-funny',
  templateUrl: './funny.component.html',
  styleUrls: ['./funny.component.scss'],
})
export class FunnyComponent implements OnInit {
  getDevices = new GetDevices()

  constructor() {}

  ngOnInit(): void {
    this.getDevices.execute('audiooutput').then((devices) => {
      console.log(devices)
    })
  }
}
