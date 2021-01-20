import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { ClipboardModule } from '@angular/cdk/clipboard'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PeekCodeComponent } from './code.component'
import { ReactiveFormsModule } from '@angular/forms'
import { PeekCodeControl } from './code.control'

describe('PeekCodeComponent', () => {
  let component: PeekCodeComponent
  let fixture: ComponentFixture<PeekCodeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatInputModule,
        ClipboardModule,
        MatDialogModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [PeekCodeComponent, PeekCodeControl],
      providers: [{ provide: MatDialogRef, useValue: { close: jest.fn() } }],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PeekCodeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
