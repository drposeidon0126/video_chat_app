import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { PwnedCheckDirective } from './pwned-check.directive'

describe('PwnedCheckDirective', () => {
  // let _http: HttpClient

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [PwnedCheckDirective],
    }).compileComponents()

    // _http = TestBed.inject(HttpClient)
  })
  it('should create an instance', () => {
    const directive = new PwnedCheckDirective(null)
    expect(directive).toBeTruthy()
  })
})
