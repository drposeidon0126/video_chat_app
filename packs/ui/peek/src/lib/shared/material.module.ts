import { NgModule } from '@angular/core'
import { MatBottomSheetModule } from '@angular/material/bottom-sheet'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  exports: [
    MatBottomSheetModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
  ],
})
export class PeekMaterialModule {}
