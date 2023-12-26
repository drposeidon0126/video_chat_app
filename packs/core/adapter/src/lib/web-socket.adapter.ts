import * as io from 'socket.io-client'
import { share } from 'rxjs/operators'
import { Observable } from 'rxjs'

export interface WebSocketConfig {
  url: string
  options?: any
}

export function SocketFactory(config: WebSocketConfig) {
  return new SocketAdapter(config)
}

export class SocketAdapter {
  subscribersCounter: Record<string, number> = {}
  eventObservables$: Record<string, Observable<any>> = {}
  ioSocket: any
  emptyConfig: WebSocketConfig = {
    url: '',
    options: {},
  }

  constructor(readonly config: WebSocketConfig) {
    if (config === undefined) {
      config = this.emptyConfig
    }
    const url: string = config.url
    const options: any = config.options
    const ioFunc = (io as any).default ? (io as any).default : io
    this.ioSocket = ioFunc(url, options)
  }

  of(namespace: string) {
    this.ioSocket.of(namespace)
  }

  on(eventName: string, callback: Function) {
    this.ioSocket.on(eventName, callback)
  }

  once(eventName: string, callback: Function) {
    this.ioSocket.once(eventName, callback)
  }

  connect() {
    return this.ioSocket.connect()
  }

  disconnect(close?: any) {
    return this.ioSocket.disconnect.apply(this.ioSocket, arguments)
  }

  emit(eventName: string, ...args: any[]) {
    return this.ioSocket.emit.apply(this.ioSocket, arguments)
  }

  removeListener(eventName: string, callback?: Function) {
    return this.ioSocket.removeListener.apply(this.ioSocket, arguments)
  }

  removeAllListeners(eventName?: string) {
    return this.ioSocket.removeAllListeners.apply(this.ioSocket, arguments)
  }

  fromEvent<T>(eventName: string): Observable<T> {
    if (!this.subscribersCounter[eventName]) {
      this.subscribersCounter[eventName] = 0
    }
    this.subscribersCounter[eventName]++

    if (!this.eventObservables$[eventName]) {
      this.eventObservables$[eventName] = new Observable((observer: any) => {
        const listener = (data: T) => {
          observer.next(data)
        }
        this.ioSocket.on(eventName, listener)
        return () => {
          this.subscribersCounter[eventName]--
          if (this.subscribersCounter[eventName] === 0) {
            this.ioSocket.removeListener(eventName, listener)
            delete this.eventObservables$[eventName]
          }
        }
      }).pipe(share())
    }
    return this.eventObservables$[eventName]
  }

  fromOneTimeEvent<T>(eventName: string): Promise<T> {
    return new Promise<T>((resolve) => this.once(eventName, resolve))
  }
}
