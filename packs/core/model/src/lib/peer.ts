import * as Socket from 'socket.io-client'

export type PeerType = 'sender' | 'receiver'

export class Peer {
  id: String
  type: PeerType
  contact: SocketIOClient.Socket

  /**
   * manter o controle de algum estado de
   * negociação para evitar corridas e erros
   */
  makingOffer = false
  ignoreOffer = false
  isSettingRemoteAnswerPending = false

  offerOptions: RTCOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  }

  constructor(id: string, type?: PeerType) {
    this.id = id
    this.type = type ?? 'receiver'
    this.contact = Socket.connect('http://localhost:3000')
  }
}
