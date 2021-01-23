import { RouterTestingModule } from '@angular/router/testing'
import { MatDialogModule } from '@angular/material/dialog'
import { TestBed } from '@angular/core/testing'

import { VoiceGuard } from './voice.guard'

describe('VoiceGuard', () => {
  let guard: VoiceGuard

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule],
    })
    guard = TestBed.inject(VoiceGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
