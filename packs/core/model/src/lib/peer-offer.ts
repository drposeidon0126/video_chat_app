import { PeerAction } from './peer-action'

export interface PeerOffer {
  type: PeerAction
  sender?: string
  room: string
  sdp: any
}
