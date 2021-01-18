import { MatBottomSheetModule } from '@angular/material/bottom-sheet'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatCardModule } from '@angular/material/card'
import { MatTabsModule } from '@angular/material/tabs'
import { MatIconModule } from '@angular/material/icon'
import { NgModule } from '@angular/core'

@NgModule({
  exports: [
    MatBottomSheetModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatGridListModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTabsModule,
  ],
})
export class PeekMaterialModule {}
