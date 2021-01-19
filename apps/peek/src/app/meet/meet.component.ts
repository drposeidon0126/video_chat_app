import { env } from './../../envs/env'
import { Router } from '@angular/router'
import { WebSocketFacade } from '@peek/core/adapter'
import { PeerAction, uuid, WithTarget } from '@peek/core/model'
import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export type WebRTCPeerConnection = RTCPeerConnection & {
  addStream: (stream: MediaStream) => {}
  onremovestream: Function
}
export const configuration: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.stunprotocol.org:3478' }],
}
const stringify = (obj: object) => JSON.stringify(obj)
const toJSON = (str: string) => JSON.parse(str)

@Component({
  selector: 'peek-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss'],
})
export class MeetComponent implements AfterViewInit, OnDestroy {
  @ViewChild('localVideo')
  localVideoRef: ElementRef<HTMLVideoElement>
  localVideo: HTMLVideoElement

  @ViewChild('remoteVideo')
  remoteVideoRef: ElementRef<HTMLVideoElement>
  remoteVideo: HTMLVideoElement

  private _crop = new BehaviorSubject<boolean>(true)
  crop = this._crop.asObservable()

  private _audio = new BehaviorSubject<boolean>(true)
  audio = this._audio.asObservable()

  private _video = new BehaviorSubject<boolean>(true)
  video = this._video.asObservable()

  private _screen = new BehaviorSubject<boolean>(true)
  screen = this._screen.asObservable()

  private _state = new BehaviorSubject<RTCSignalingState>('closed')
  state = this._state.asObservable()

  pc: WebRTCPeerConnection

  localStream: MediaStream

  sender = uuid()

  constructor(private _router: Router, private socket: WebSocketFacade) {}

  ngAfterViewInit(): void {
    this.localVideo = this.localVideoRef.nativeElement
    this.remoteVideo = this.remoteVideoRef.nativeElement

    this.initCall()
  }

  initCall() {
    this.socket.on(PeerAction.Offer, this.readMessage.bind(this))

    try {
      this.pc = this.createConnection(configuration)
    } catch (error) {
      this.pc = this.createConnection(configuration)
    }

    this.pc.onsignalingstatechange = ({
      target,
    }: WithTarget<RTCPeerConnection>) => {
      console.log(target.signalingState)
      this._state.next(target.signalingState)
    }

    this.pc.onicecandidate = ({ candidate }) => {
      candidate
        ? this.sendMessage(this.sender, stringify({ ice: candidate }))
        : console.log('1. Sent All Ice')
    }

    this.pc.onremovestream = () => {
      console.log('Stream Ended')
    }

    this.pc.ontrack = ({ streams }) => (this.remoteVideo.srcObject = streams[0])

    this.setLocalStream()
  }

  createConnection(configuration: RTCConfiguration) {
    return new RTCPeerConnection(configuration) as WebRTCPeerConnection
  }

  sendMessage(sender: string, message: any) {
    this.socket.emit(PeerAction.Offer, { sender, message })
  }

  readMessage({ message, sender }: any) {
    try {
      const { ice, sdp } = toJSON(message)

      if (sender !== this.sender) {
        if (ice !== undefined && this.pc !== null) {
          this.pc.addIceCandidate(new RTCIceCandidate(ice))
        } else if (sdp && sdp.type === PeerAction.Offer) {
          this.pc &&
            this.pc
              .setRemoteDescription(new RTCSessionDescription(sdp))
              .then(() => this.pc.createAnswer())
              .then((a) => this.pc.setLocalDescription(a))
              .then(() => {
                const message = { sdp: this.pc.localDescription }
                this.sendMessage(this.sender, stringify(message))
              })
        } else if (sdp && sdp.type === 'answer') {
          this.pc &&
            this.pc.setRemoteDescription(new RTCSessionDescription(sdp))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  toggleCrop() {
    this._crop.next(!this._crop.getValue())
  }

  toggleAudio() {
    const enabled = !this._audio.getValue()
    const tracks = this.localStream.getAudioTracks()
    tracks.forEach((t) => (t.enabled = enabled))
    this._audio.next(enabled)
  }

  toggleVideo() {
    const enabled = !this._video.getValue()
    const tracks = this.localStream.getVideoTracks()
    tracks.forEach((t) => (t.enabled = enabled))
    this._video.next(enabled)
  }

  toggleScreen() {
    const enabled = !this._video.getValue()
    const tracks = this.localStream.getVideoTracks()
    tracks.forEach((t) => (t.enabled = enabled))
    this._screen.next(enabled)
  }

  shareScreen() {
    const tracks = this.localStream.getAudioTracks()
    tracks.forEach(t => t.stop())

    this.getDisplayMedia().then((stream) => {
      this.pc.addStream(stream)
      this.localStream = stream
      this.localVideo.srcObject = null
      this.localVideo.srcObject = stream
      this.localVideo.muted = true
      this.setRemoteStream()
    })

  }

  getDisplayMedia(): Promise<MediaStream> {
    const configuration = { video: true }
    const mediaDevices = navigator.mediaDevices
    if ('getDisplayMedia' in navigator) {
      return (navigator as any).getDisplayMedia(configuration)
    } else if ('getDisplayMedia' in mediaDevices) {
      return (mediaDevices as any).getDisplayMedia(configuration)
    } else {
      return mediaDevices.getUserMedia({
        video: { mediaSourcee: 'screen' },
      } as MediaStreamConstraints)
    }
  }

  setLocalStream() {
    navigator.mediaDevices.getUserMedia(env.constraints).then((stream) => {
      this.pc.addStream(stream)
      this.localStream = stream
      this.localVideo.srcObject = null
      this.localVideo.srcObject = stream
      this.setRemoteStream()
    })
  }

  setRemoteStream() {
    try {
      this.pc
        .createOffer()
        .then((offer) => this.pc.setLocalDescription(offer))
        .then(() => {
          const message = { sdp: this.pc.localDescription }
          this.sendMessage(this.sender, stringify(message))
          this.localVideo.muted = true
          console.log(this.pc.localDescription.sdp);

        })
    } catch (error) {
      this.initCall()
      console.log(error)
    }
  }

  stop() {
    const tracks = this.localStream.getTracks()
    tracks.forEach((t) => t.stop())
  }

  hangup() {
    this.stop()
    this.pc.close()
    this._state.next('closed')
    this._router.navigateByUrl('/')
  }

  ngOnDestroy(): void {
    this.stop()
    if (this.pc) {
      this.pc.close()
      this.pc = null
    }
  }
}
