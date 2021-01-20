import { uuid, PeekError, PeekPayload, PeerAction, WithTarget, PeekCode } from '@peek/core/model'
import { WebSocketFacade } from '@peek/core/adapter'
import { BehaviorSubject } from 'rxjs'

declare global {
  interface RTCPeerConnection {
    addStream: (stream: MediaStream) => {}
    onremovestream: Function
  }
}

export class CreatePeek {
  sender = uuid()

  private _state = new BehaviorSubject<RTCSignalingState>('closed')
  state = this._state.asObservable()

  private _track = new BehaviorSubject<readonly MediaStream[]>([])
  track = this._track.asObservable()

  constructor(
    private socket: WebSocketFacade,
    private code: PeekCode,
    public pc: RTCPeerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.stunprotocol.org:3478' }],
    })
  ) {
    this.socket.on(PeerAction.Offer, this.handle.bind(this))

    this.pc.onsignalingstatechange = ({
      target,
    }: WithTarget<RTCPeerConnection>) => {
      console.log(target.signalingState)
      this._state.next(target.signalingState)
    }

    this.pc.onicecandidate = ({ candidate }) => {
      candidate
        ? this.send(new PeekPayload(this.sender, this.code, { ice: candidate }))
        : console.log('Sent All Ice')
    }

    this.pc.ontrack = ({ streams }) => this._track.next(streams)
  }

  handle({ payload, code, sender }: PeekPayload) {
    try {
      if (sender !== this.sender) {
        const { sdp, ice } = payload
        if (this.pc !== null && ice !== undefined) {
          this.pc.addIceCandidate(new RTCIceCandidate(ice))
        }
        if (sdp)
          switch (sdp.type) {
            case PeerAction.Offer:
              return this.createAnswer(sdp)
            case PeerAction.Answer:
              return this.setRemote(sdp)
          }
      }
    } catch (error) {
      throw new PeekError('handle-message', 2)
    }
  }

  async createAnswer(sdp: RTCSessionDescription) {
    try {
      return this.pc
        .setRemoteDescription(new RTCSessionDescription(sdp))
        .then(() => this.pc.createAnswer())
        .then((a) => this.pc.setLocalDescription(a))
        .then(() => {
          const sdp = { sdp: this.pc.localDescription }
          this.send(new PeekPayload(this.sender, this.code, sdp))
        })
    } catch (error) {
      throw new PeekError('create-answer', 3)
    }
  }

  async createOffer() {
    try {
      return this.pc
        .createOffer({
          voiceActivityDetection: true,
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        })
        .then((offer) => this.pc.setLocalDescription(offer))
        .then(() => ({ sdp: this.pc.localDescription }))
        .then((sdp) => this.send(new PeekPayload(this.sender, this.code, sdp)))
    } catch (error) {
      throw new PeekError('create-peer', 0)
    }
  }

  setRemote(sdp: RTCSessionDescription) {
    this.pc.setRemoteDescription(new RTCSessionDescription(sdp))
  }

  private send(message: PeekPayload) {
    this.socket.emit(PeerAction.Offer, message)
  }

  close() {
    this.pc.close()
    this._state.next('closed')
  }
}
