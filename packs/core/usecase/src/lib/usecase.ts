import { Observable } from 'rxjs'

export abstract class UseCase<S, T> {
  // abstract execute(params: S): Observable<T>
  abstract execute(params: S): Promise<T>
}
