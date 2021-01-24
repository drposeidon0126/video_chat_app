import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AuthModule } from './auth.module'
import { ReactiveFormsModule } from '@angular/forms'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AuthComponent } from './auth.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('AuthComponent', () => {
  let component: AuthComponent
  let fixture: ComponentFixture<AuthComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        AuthModule,
      ],
      // declarations: [ AuthComponent ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
