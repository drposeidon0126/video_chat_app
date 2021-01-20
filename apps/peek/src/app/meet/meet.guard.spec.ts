import { RouterTestingModule } from '@angular/router/testing'
import { MatDialogModule } from '@angular/material/dialog'
import { TestBed } from '@angular/core/testing'

import { MeetGuard } from './meet.guard'

describe('MeetGuard', () => {
  let guard: MeetGuard

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, RouterTestingModule],
    })
    guard = TestBed.inject(MeetGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
