import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Route } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MicroUpgradeComponent } from './micro-upgrade.component';
import { RoomContainer } from './containers/room/room.container'

export const microUpgradeRoutes: Route[] = [
  // { path: '', component: MicroUpgradeComponent },
  { path: '', component: RoomContainer },
]

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatToolbarModule, RouterModule],
  declarations: [MicroUpgradeComponent, RoomContainer],
})
export class MicroUpgradeModule {}
