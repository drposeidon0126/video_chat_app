import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ReactiveFormsModule } from '@angular/forms'

import { PeerCodeComponent } from './peer-code.component'

describe('PeerCodeComponent', () => {
  let component: PeerCodeComponent
  let fixture: ComponentFixture<PeerCodeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
      declarations: [PeerCodeComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerCodeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
