import { Observable } from 'rxjs'

export interface IMessage {
  description?: RTCSessionDescription
  candidate?: RTCIceCandidate
  sender?: string
}

export interface ISignaling {
  message$: Observable<IMessage>
  send(data: IMessage): void
}

import * as io from 'socket.io-client'
import { Subject } from 'rxjs'

export class Signaling implements ISignaling {
  io!: SocketIOClient.Socket

  private message = new Subject<IMessage>()
  message$ = this.message.asObservable()

  constructor(uri: string) {
    console.log({ uri })
    if (uri) {
      this.io = io.connect(uri)
      this.io.on('message', (evt: IMessage) => this.message.next(evt))
    }
  }

  send(data: IMessage): void {
    this.io.send(data)
  }
}
