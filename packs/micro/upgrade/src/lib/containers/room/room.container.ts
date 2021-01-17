import { Media, PeerAction, Signaling, uuid } from '@peek/core/model'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject, Subject } from 'rxjs'
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core'

type StateButton = 'call' | 'upgrade' | 'hangup'

@Component({
  templateUrl: './room.container.html',
  styleUrls: ['./room.container.scss'],
})
export class RoomContainer implements AfterViewInit, OnDestroy {
  @ViewChild('localVideo')
  localVideoRef: ElementRef<HTMLVideoElement>
  localVideo: HTMLVideoElement

  @ViewChild('remoteVideo')
  remoteVideoRef: ElementRef<HTMLVideoElement>
  remoteVideo: HTMLVideoElement

  private _crop = new BehaviorSubject<boolean>(false)
  crop = this._crop.asObservable()

  private _audio = new BehaviorSubject<boolean>(true)
  audio = this._audio.asObservable()

  private _video = new BehaviorSubject<boolean>(false)
  video = this._video.asObservable()

  private _state: Partial<Record<StateButton, boolean>>
  public get state(): Partial<Record<StateButton, boolean>> {
    return this._state
  }
  public set state(value: Partial<Record<StateButton, boolean>>) {
    this._state = { ...this._state, ...value }
  }

  destroy$ = new Subject<void>()

  active = new Subject<boolean>()
  active$ = this.active.asObservable()

  pc: RTCPeerConnection
  sender: string
  isCaller: boolean

  localStream: MediaStream
  remoteStream: MediaStream

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _signaling: Signaling,
    private _media: Media
  ) {
    this.sender = uuid()
    this.state = {
      call: false,
      upgrade: true,
      hangup: true,
    }
  }

  toggleCrop() {
    this._crop.next(!this._crop.getValue())
  }
  toggleAudio() {
    this._audio.next(!this._audio.getValue())
  }
  toggleVideo() {
    this._video.next(!this._video.getValue())
  }

  call() {
    this.state = {
      call: true,
      upgrade: false,
      hangup: false,
    }

    const code = 'abc123'
    if (code) {
      this._signaling.io.emit(PeerAction.CreateOrJoin, code)
    }
  }

  upgrade() {}

  ngAfterViewInit() {
    this.localVideo = this.localVideoRef.nativeElement
    this.remoteVideo = this.remoteVideoRef.nativeElement

    const { code } = this._route.snapshot.params

    this._signaling.io.on(PeerAction.Created, (room: string) => {
      this._media.getUserMedia({ audio: true }).then((stream) => {
        this.localStream = stream
        this.localVideo.srcObject = stream
        this.isCaller = true
      })
    })

    this._signaling.io.on(PeerAction.Joined, (room: string) => {
      this._media.getUserMedia({ audio: true }).then((stream) => {
        this.localStream = stream
        this.localVideo.srcObject = stream
        this._signaling.io.emit(PeerAction.Ready, code)
      })
    })

    this._signaling.io.on(PeerAction.Candidate, (event) => {
      var candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate,
      })
      this.pc.addIceCandidate(candidate)
    })

    this._signaling.io.on(PeerAction.Ready, () => {
      if (this.isCaller) {
        this.pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.stunprotocol.org:3478' }],
        })
        this.pc.onicecandidate = ({ candidate }) =>
          this.onIceCandidate(code, candidate)

        this.pc.ontrack = (event) => this.onAddStream(event)

        this.localStream.getTracks().forEach((track) => {
          this.pc.addTrack(track, this.localStream)
        })

        this.pc
          .createOffer()
          .then((o) => {
            this.pc.setLocalDescription(o)
            this._signaling.io.emit(PeerAction.Offer, {
              type: PeerAction.Offer,
              sdp: o,
              room: code,
            })
          })
          .catch((error) => {
            console.error(error)
          })
      }
    })

    this._signaling.io.on(
      PeerAction.Offer,
      (event: RTCSessionDescriptionInit) => {
        this.pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.stunprotocol.org:3478' }],
        })
        this.pc.onicecandidate = ({ candidate }) => {
          this.onIceCandidate(code, candidate)
        }

        this.pc.ontrack = (e) => {
          this.onAddStream(e)
        }

        this.localStream.getTracks().forEach((track) => {
          this.pc.addTrack(track, this.localStream)
        })

        this.pc.setRemoteDescription(new RTCSessionDescription(event))
        this.pc
          .createAnswer()
          .then((a) => {
            this.pc.setLocalDescription(a)
            this._signaling.io.emit(PeerAction.Answer, {
              type: PeerAction.Answer,
              sdp: a,
              room: code,
            })
          })
          .catch((error) => {
            console.error(error)
          })
      }
    )

    this._signaling.io.on(
      PeerAction.Answer,
      (event: RTCSessionDescriptionInit) => {
        this.pc.setRemoteDescription(new RTCSessionDescription(event))
      }
    )
  }

  onIceCandidate(code: string, candidate: RTCIceCandidate) {
    if (candidate) {
      console.log('sending ice candidate')
      this._signaling.io.emit(PeerAction.Candidate, {
        type: PeerAction.Candidate,
        label: candidate.sdpMLineIndex,
        id: candidate.sdpMid,
        candidate: candidate.candidate,
        room: code,
      })
    }
  }

  onAddStream({ streams }: RTCTrackEvent) {
    this.remoteVideo.srcObject = streams[0]
    // this.remoteStream = stream;
  }

  hangup() {
    this._router.navigate(['/home'])
  }

  ngOnDestroy() {
    if (this.localStream?.active) {
      this.localStream.getTracks().forEach((t) => t.stop())
    }
    if (this._signaling?.io.connected) {
      this._signaling.io.disconnect()
    }

    if (this.pc) {
      this.pc.close()
      Object.defineProperties(this.pc, {})
    }
    this.destroy$.next()
    this.destroy$.complete()
    this.active.next(false)
  }
}
