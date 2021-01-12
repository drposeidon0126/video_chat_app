import { Payload } from './payload'

export class Message implements Payload {
  sender?: string
  candidate?: RTCIceCandidate
  description?: RTCSessionDescription

  constructor({ sender, description, candidate }: Payload) {
    this.sender = sender
    this.candidate = candidate
    this.description = description
  }
}
