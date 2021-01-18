import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { WebSocketFacade } from '@peek/core/adapter'
import { MeetComponent } from './meet.component'

const webSocketMock = {
  on: jest.fn(),
  send: jest.fn(),
}

describe('MeetComponent', () => {
  let component: MeetComponent
  let fixture: ComponentFixture<MeetComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
      ],
      declarations: [MeetComponent],
      providers: [{ provide: WebSocketFacade, useValue: webSocketMock }],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
