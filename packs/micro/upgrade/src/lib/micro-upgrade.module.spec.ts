import { TestBed, waitForAsync } from '@angular/core/testing'
import { MicroUpgradeModule } from './micro-upgrade.module'

describe('MicroUpgradeModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MicroUpgradeModule],
    }).compileComponents()
  }))

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(MicroUpgradeModule).toBeDefined()
  })
})
