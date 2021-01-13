import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { ToPeerComponent } from './components/to-peer/to-peer.component'

@NgModule({
  imports: [CommonModule],
  declarations: [ToPeerComponent],
  exports: [ToPeerComponent],
})
export class UiPeekModule {}
