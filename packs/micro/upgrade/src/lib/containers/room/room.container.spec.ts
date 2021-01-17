import { Signaling, Message, Media } from '@peek/core/model'
import { RouterTestingModule } from '@angular/router/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RoomContainer } from './room.container'
import { of } from 'rxjs'

const signalingMock = {
  io: {
    on: jest.fn(),
  },
  message$: of({}),
  send: (data: Message) => {},
}

const mediaMock = {
  getUserMedia: jest.fn().mockResolvedValue({}),
}
signalingMock.message$
describe('RoomContainer', () => {
  let component: RoomContainer
  let fixture: ComponentFixture<RoomContainer>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
      ],
      declarations: [RoomContainer],
      providers: [
        { provide: Signaling, useValue: signalingMock },
        { provide: Media, useValue: mediaMock },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomContainer)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
