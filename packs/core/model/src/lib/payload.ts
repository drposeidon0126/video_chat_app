import { PeekCode } from './code'

export interface Payload {
  sdp?: RTCSessionDescription
  ice?: RTCIceCandidate
}

export class PeekPayload {
  constructor(
    public sender: string,
    public code: string,
    public payload: Payload = {}
  ) {}
}
export interface PeekPayload {
  sender: string
  code: string
  payload: Payload
}


