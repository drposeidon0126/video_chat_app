import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { env } from '../../envs/env'
import { Signaling, Media } from '@peek/core/model'
import {
  CorePeekModule,
  PeekMaterialModule,
  SignalingFactory,
  SIGNALING_CLIENT,
  MediaFactory,
  MEDIA_CONSTRAINTS,
} from '@peek/core/peek'

const media = {
  getUserMedia: jest.fn().mockImplementation((query) => {
    return new Promise((resolve, reject) => {
      return {
        getTracks: jest.fn().mockResolvedValue([1, 2, 3]),
      }
    })
  }),
  getDevices: jest.fn(),
  getDisplayMedia: jest.fn(),
}
import { One2oneComponent } from './one2one.component'

describe('One2oneComponent', () => {
  let component: One2oneComponent
  let fixture: ComponentFixture<One2oneComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorePeekModule, PeekMaterialModule, RouterTestingModule],
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
        {
          provide: MEDIA_CONSTRAINTS,
          useValue: env.constraints,
        },
        {
          provide: Media,
          useFactory: MediaFactory,
          deps: [MEDIA_CONSTRAINTS],
        },
        {
          provide: Media,
          useValue: media,
        },
      ],
      declarations: [One2oneComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(One2oneComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should self video be muted, but no remote', async () => {
    spyOn(component, 'active$')
    component.active$.toPromise().then(() => {
      expect(component.active.next).toBeCalled()
      expect(component.selfView.muted).toBeTruthy()
      expect(component.remoteView.muted).toBeFalsy()
    })
  })

  it('should self video be muted, but no remote', async () => {
    spyOn(component, 'active$')
    component.active$.toPromise().then(() => {
      expect(component.selfView.srcObject).toBeDefined()
    })
  })
})
