import { TestBed } from '@angular/core/testing';
import { AuthDataService } from '../infra/auth-data.service';
import { AuthFacade } from './auth.facade';

const authDataServiceMock = {
  login: jest.fn()
}

describe('AuthFacade', () => {
  let service: AuthDataService;
  let facade: AuthFacade

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthDataService, useValue: authDataServiceMock }
      ]
    });
    service = TestBed.inject(AuthDataService);
  });

  beforeEach(() => {
    facade = new AuthFacade(service)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(facade).toBeTruthy();
  });

  // it('should create an instance', () => {
  //   spyOn()facade.currentUser$
  //   expect().toBeTruthy();
  // });
});
