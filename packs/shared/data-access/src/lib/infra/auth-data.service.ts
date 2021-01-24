import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Auth, User } from '@peek/core/entity'

@Injectable()
export class AuthDataService {
  constructor(readonly http: HttpClient) {}

  login(data: Auth) {
    return this.http.post<User>('/auth/login', data)
  }
}
