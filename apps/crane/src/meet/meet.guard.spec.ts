import { Test, TestingModule } from '@nestjs/testing'
import { MeetGuard } from './meet.guard'

describe('MeetGuard', () => {
  let guard: MeetGuard
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetGuard],
    }).compile()

    guard = module.get<MeetGuard>(MeetGuard)
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })
})
