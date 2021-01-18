import { navigation } from '../app-navigation'
import { Component } from '@angular/core'

@Component({
  selector: 'peek-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  pages = Object.values(navigation)
}
