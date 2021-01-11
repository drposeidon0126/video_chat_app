import { Code, code } from '@peek/core/model';
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'peek-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'peek'

  ngOnInit(): void {
    const user = new Code(code())
    console.log(user);

  }
}
