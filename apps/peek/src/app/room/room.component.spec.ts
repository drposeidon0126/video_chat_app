import { ComponentFixture, TestBed } from '@angular/core/testing'
import { env } from '../../envs/env'
import { RoomComponent } from './room.component'
import { Signaling } from '@peek/core/model'
import {
  SignalingFactory,
  SIGNALING_CLIENT,
  CorePeekModule,
  PeekMaterialModule,
} from '@peek/core/peek'

(window as any).getMedia = jest.fn()

describe('RoomComponent', () => {
  let component: RoomComponent
  let fixture: ComponentFixture<RoomComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorePeekModule, PeekMaterialModule],
      providers: [
        {
          provide: SIGNALING_CLIENT,
          useValue: env.seek,
        },
        {
          provide: Signaling,
          useFactory: SignalingFactory,
          deps: [SIGNALING_CLIENT],
        },
      ],
      declarations: [RoomComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
