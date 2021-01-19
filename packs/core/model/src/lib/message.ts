import { Payload } from './payload'

export class PeekMessage implements Payload {
  sender?: string
  ice?: RTCIceCandidate
  sdp?: RTCSessionDescription

  constructor(sender: string, { sdp, ice }: Partial<Payload>) {
    this.sender = sender
    this.ice = ice
    this.sdp = sdp
  }
}
