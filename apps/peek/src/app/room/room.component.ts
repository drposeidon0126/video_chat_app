import { Media, PeerAction, Signaling, uuid } from '@peek/core/model'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core'

@Component({
  selector: 'peek-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements AfterViewInit, OnDestroy {
  @ViewChild('selfView') localVideoRef: ElementRef<HTMLVideoElement>
  localVideo: HTMLVideoElement

  @ViewChild('remoteView') remoteVideoRef: ElementRef<HTMLVideoElement>
  remoteVideo: HTMLVideoElement

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
  ) {}

  ngAfterViewInit() {
    this.sender = uuid()
    this.localVideo = this.localVideoRef.nativeElement
    this.remoteVideo = this.remoteVideoRef.nativeElement

    const { code } = this._route.snapshot.params
    console.log(code);

    if (code) {
      this._signaling.io.emit(PeerAction.CreateOrJoin, code)
    }

    this._signaling.io.on(PeerAction.Created, (room: string) => {
      this._media.getUserMedia().then((stream) => {
        this.localStream = stream
        this.localVideo.srcObject = stream
        this.isCaller = true
      })
    })

    this._signaling.io.on(PeerAction.Joined, (room: string) => {
      this._media.getUserMedia().then((stream) => {
        this.localStream = stream
        this.localVideo.srcObject = stream
        this._signaling.io.emit('ready', code)
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

    this._signaling.io.on(PeerAction.Offer, (event) => {
      this.pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.stunprotocol.org:3478' }],
      })
      this.pc.onicecandidate = ({ candidate }) =>
        this.onIceCandidate(code, candidate)

      this.pc.ontrack = (event) => this.onAddStream(event)

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
    })

    this._signaling.io.on(PeerAction.Answer, (event) => {
      this.pc.setRemoteDescription(new RTCSessionDescription(event))
    })
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
