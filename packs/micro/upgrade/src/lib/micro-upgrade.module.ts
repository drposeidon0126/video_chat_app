import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Route } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MicroUpgradeComponent } from './micro-upgrade.component'

export const microUpgradeRoutes: Route[] = [
  { path: '', component: MicroUpgradeComponent },
]

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatToolbarModule, RouterModule],
  declarations: [MicroUpgradeComponent],
})
export class MicroUpgradeModule {}
