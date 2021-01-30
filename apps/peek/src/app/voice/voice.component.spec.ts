import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { SharedElementsModule } from '@peek/shared/elements'
import { SocketAdapter } from '@peek/core/adapter'
import { VoiceComponent } from './voice.component'

const webSocketMock = {
  on: jest.fn(),
  send: jest.fn(),
  emit: jest.fn(),
}

describe('VoiceComponent', () => {
  let component: VoiceComponent
  let fixture: ComponentFixture<VoiceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoiceComponent],
      imports: [RouterTestingModule, SharedElementsModule],
      providers: [{ provide: SocketAdapter, useValue: webSocketMock }],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
