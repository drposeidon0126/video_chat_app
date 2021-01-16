import { MatButtonModule } from '@angular/material/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Route } from '@angular/router'
import { MicroUpgradeComponent } from './micro-upgrade.component'

export const microUpgradeRoutes: Route[] = [
  { path: 'upgrade', component: MicroUpgradeComponent },
]

@NgModule({
  imports: [CommonModule, MatButtonModule, RouterModule],
  declarations: [MicroUpgradeComponent],
})
export class MicroUpgradeModule {}
