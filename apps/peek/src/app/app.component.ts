import { Code, code } from '@peek/core/model'
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'

@Component({
  selector: 'peek-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'peek'

  ngAfterViewInit(): void {
    const user = code()
    console.log(user)
   }
}
