import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PeekCodeControl } from './code.control'
import { ReactiveFormsModule } from '@angular/forms'

describe('PeekCodeControl', () => {
  let component: PeekCodeControl
  let fixture: ComponentFixture<PeekCodeControl>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule],
      declarations: [PeekCodeControl],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PeekCodeControl)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
