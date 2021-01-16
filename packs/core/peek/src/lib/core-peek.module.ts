import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { ToPeerComponent } from './components/to-peer/to-peer.component'
import { PeerCodeComponent } from './components/peer-code/peer-code.component'

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  declarations: [ToPeerComponent, PeerCodeComponent],
  exports: [ToPeerComponent, PeerCodeComponent],
})
export class CorePeekModule {}
