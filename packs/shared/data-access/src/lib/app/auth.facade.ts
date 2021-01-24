import { Injectable } from '@angular/core'
import { Auth, User } from '@peek/core/entity'
import { BehaviorSubject, Subject, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AuthDataService } from '../infra/auth-data.service'

@Injectable()
export class AuthFacade {
  private _currentUser = new BehaviorSubject<User>(null)
  currentUser$ = this._currentUser.asObservable()

  private _error = new Subject<Error>()
  error$ = this._error.asObservable()

  constructor(private _dataService: AuthDataService) {}

  login(credential: Auth) {
    this._error.next(null)
    this._dataService
      .login(credential)
      .pipe(
        catchError((error) => {
          this._error.next(error)
          return throwError(error)
        })
      )
      .subscribe((user) => this._currentUser.next(user))
  }
}
