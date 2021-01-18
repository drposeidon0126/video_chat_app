import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatSidenavModule } from '@angular/material/sidenav'
import { env } from '../envs/env'
import { AppComponent } from './app.component'
import { Signaling } from '@peek/core/model'
import {
  SignalingFactory,
  SIGNALING_CLIENT,
  CorePeekModule,
  PeekMaterialModule,
} from '@peek/core/peek'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CorePeekModule,
        PeekMaterialModule,
        MatSidenavModule,
        BrowserAnimationsModule,
      ],
      declarations: [AppComponent],
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
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it(`should have as title 'peek'`, () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('peek')
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const compiled = fixture.nativeElement
    expect(compiled.querySelector('h1').textContent).toContain(
      'peek'
    )
  })
})
