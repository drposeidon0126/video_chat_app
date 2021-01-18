import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Route } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MicroNegotiateComponent } from './micro-negotiate.component'

export const microNegotiateRoutes: Route[] = [
  { path: '', component: MicroNegotiateComponent },
]

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
  ],
  declarations: [MicroNegotiateComponent],
  providers: [],
})
export class MicroNegotiateModule {}
