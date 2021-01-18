import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MicroNegotiateComponent } from './micro-negotiate.component'
import { WebSocketFacade } from '@peek/core/adapter'

const webSocketMock = {
  on: jest.fn(),
  send: jest.fn(),
}

describe('MicroNegotiateComponent', () => {
  let component: MicroNegotiateComponent
  let fixture: ComponentFixture<MicroNegotiateComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, MatButtonModule, MatToolbarModule],
      declarations: [MicroNegotiateComponent],
      providers: [{ provide: WebSocketFacade, useValue: webSocketMock }],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroNegotiateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
