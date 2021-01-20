import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { ClipboardModule } from '@angular/cdk/clipboard'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PeekCodeDialog } from './code.dialog'
import { ReactiveFormsModule } from '@angular/forms'

describe('PeekCodeDialog', () => {
  let component: PeekCodeDialog
  let fixture: ComponentFixture<PeekCodeDialog>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        ClipboardModule,
        MatTooltipModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [PeekCodeDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, value: {} },
        { provide: MatDialogRef, useValue: {} }
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PeekCodeDialog)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
