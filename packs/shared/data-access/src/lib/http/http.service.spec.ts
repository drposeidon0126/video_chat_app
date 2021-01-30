import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { SHARED_DATA_ACCESS_CONFIG } from '../shared-data-access-injectors'

import { HttpService } from './http.service'

describe('HttpService', () => {
  let service: HttpService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpService,
        {
          provide: SHARED_DATA_ACCESS_CONFIG,
          useValue: { apiPrefix: '/api' },
        },
      ],
    })
    service = TestBed.inject(HttpService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
