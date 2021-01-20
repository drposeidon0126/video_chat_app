import { PeekCode } from './code'

export interface Payload {
  sdp?: RTCSessionDescription
  ice?: RTCIceCandidate
}

export class PeekPayload {
  constructor(
    public sender: string,
    public code: PeekCode,
    public payload: Payload = {}
  ) {}
}
export interface PeekPayload {
  sender: string
  code: PeekCode
  payload: Payload
}


