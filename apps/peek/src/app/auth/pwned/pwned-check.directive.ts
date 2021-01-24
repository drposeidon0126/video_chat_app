import { HttpClient } from '@angular/common/http'
import { Directive } from '@angular/core'
import { sha1 } from '@peek/util/format'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms'

@Directive({
  selector: '[peekPwnedCheck]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: PwnedCheckDirective,
      multi: true,
    },
  ],
})
export class PwnedCheckDirective implements AsyncValidator {
  constructor(private _http: HttpClient) {}

  validate({ value }: AbstractControl): Observable<ValidationErrors> {
    if (value) {
      const v = sha1(value)
      const hash = v.slice(0, 5)
      type PwnedResponse = {
        passhash: string
        records: number
      }

      const founded = ({ passhash }: PwnedResponse) =>
        v.toUpperCase() === hash.toUpperCase() + passhash

      return this._http
        .post<PwnedResponse[]>('/auth/check', { hash })
        .pipe(
          map((response = []) => response.find(founded)),
          map((pwned) => (pwned ? { pwned: pwned.records } : null))
        )
    }
  }
}
