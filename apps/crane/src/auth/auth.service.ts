import { HttpService, Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { map } from 'rxjs/operators'
import pwned from '../config/pwned'
import { Observable } from 'rxjs'

export interface PwnedResponse {
  passhash: string
  records: number
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private _http: HttpService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username)
    if (user && user.password === pass) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  pwned(value: string): Observable<PwnedResponse[]> {
    return this._http
      .get<string>(pwned.api + '/range/' + value, { headers: pwned.headers })
      .pipe(
        map(({ data = '' }) => data.split('\n')),
        map((lines) => {
          return lines
            .map((line) => line.split(':'))
            .map(([passhash, records]) => ({ passhash, records: +records }))
        })
      )
  }
}
