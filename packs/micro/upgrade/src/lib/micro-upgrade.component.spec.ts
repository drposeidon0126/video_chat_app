import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MicroUpgradeComponent } from './micro-upgrade.component'
import { of } from 'rxjs'
import { Signaling, Message } from '@peek/core/model'

const signalingMock = {
  io: {
    on: jest.fn(),
  },
  message$: of({}),
  send: (data: Message) => {},
}

describe('MicroUpgradeComponent', () => {
  let component: MicroUpgradeComponent
  let fixture: ComponentFixture<MicroUpgradeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, MatButtonModule, MatToolbarModule],
      declarations: [MicroUpgradeComponent],
      providers: [{ provide: Signaling, useValue: signalingMock }],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroUpgradeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
