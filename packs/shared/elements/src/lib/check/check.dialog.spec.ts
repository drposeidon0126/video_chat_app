import { MatProgressBarModule } from '@angular/material/progress-bar'
import { CheckComponent } from './check.component'
import { MatDialogModule } from '@angular/material/dialog'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CheckDialog } from './check.dialog'

describe('CheckDialog', () => {
  let component: CheckDialog
  let fixture: ComponentFixture<CheckDialog>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatProgressBarModule],
      declarations: [CheckDialog, CheckComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckDialog)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
