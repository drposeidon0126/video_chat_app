import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { SharedDataAccessConfig } from '../shared-data-access-config'
import { SHARED_DATA_ACCESS_CONFIG } from '../shared-data-access-injectors'

@Injectable()
export class HttpService<T = any> {
  protected api: string
  protected end: string = ''

  constructor(
    protected http: HttpClient,
    @Inject(SHARED_DATA_ACCESS_CONFIG)
    readonly config: SharedDataAccessConfig
  ) {
    this.api = config.apiPrefix
    console.log('config: ', this.api)
  }

  findOne(id: number | string): Observable<T> {
    const url = `${this.api}/${this.end}/${id}`
    return this.http.get<T>(url)
  }

  find(criteria?: Record<keyof T, string>): Observable<T[]> {
    const url = `${this.api}/${this.end}`
    return this.http.get<T[]>(url, { params: criteria })
  }

  createOne(data: T) {
    return this.http.post(`${this.api}/${this.end}`, data)
  }

  updateOne(id: number, data: Partial<T>) {
    return this.http.put(`${this.api}/${this.end}/${id}`, data)
  }
}
