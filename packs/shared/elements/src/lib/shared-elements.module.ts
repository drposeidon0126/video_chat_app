import { A11yModule } from '@angular/cdk/a11y'
import { ReactiveFormsModule } from '@angular/forms'
import { PeekMaterialModule } from './material/material.module'
import { ClipboardModule } from '@angular/cdk/clipboard'
import { PeekCodeComponent } from './code/code.component'
import { PlatformModule } from '@angular/cdk/platform'
import { PeekCodeControl } from './code/code.control'
import { PeekCodeDialog } from './code/code.dialog'
import { CheckComponent } from './check/check.component'
import { CheckDialog } from './check/check.dialog'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core';
import { WaveComponent } from './wave/wave.component';
import { DevicesComponent } from './devices/devices.component';
import { ConfirmDialog } from './confirm/confirm.dialog'

@NgModule({
  imports: [
    A11yModule,
    CommonModule,
    PlatformModule,
    ClipboardModule,
    ReactiveFormsModule,
    PeekMaterialModule,
  ],
  declarations: [
    PeekCodeControl,
    PeekCodeDialog,
    PeekCodeComponent,
    CheckComponent,
    CheckDialog,
    WaveComponent,
    DevicesComponent,
    ConfirmDialog,
  ],
  exports: [
    PeekCodeControl,
    PeekCodeDialog,
    PeekCodeComponent,
    CheckComponent,
    CheckDialog,
    WaveComponent,
    DevicesComponent,
  ],
})
export class SharedElementsModule {}
