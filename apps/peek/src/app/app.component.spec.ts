import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { MatSidenavModule } from '@angular/material/sidenav'
import { TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { SharedDataAccessModule } from '@peek/shared/data-access'
import { PeekMaterialModule } from '@peek/shared/elements'
import { NavbarComponent } from './navbar/navbar.component'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedDataAccessModule,
        PeekMaterialModule,
        MatSidenavModule,
        BrowserAnimationsModule,
      ],
      declarations: [AppComponent, NavbarComponent],
      providers: [],
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
    expect(compiled.querySelector('h1').textContent).toContain('peek')
  })
})
