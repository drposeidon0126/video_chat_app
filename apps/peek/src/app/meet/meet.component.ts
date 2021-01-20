import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { WebSocketFacade } from '@peek/core/adapter'
import { CreatePeek } from '@peek/core/usecase'
import { ActivatedRoute, Router } from '@angular/router'
import { env } from './../../envs/env'
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core'

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

  state: Observable<RTCSignalingState>

  destroy = new Subject<void>()
  localStream: MediaStream
  peek: CreatePeek

  constructor(
    private _router: Router,
    socket: WebSocketFacade,
    route: ActivatedRoute
  ) {
    const code = route.snapshot.paramMap.get('code')
    if (!code) this._router.navigate(['/'])

    this.peek = new CreatePeek(socket, code)
    this.state = this.peek.state
  }

  ngAfterViewInit(): void {
    this.localVideo = this.localVideoRef.nativeElement
    this.remoteVideo = this.remoteVideoRef.nativeElement
    this.peek.onCreated(() => this.setLocalStream())
    this.peek.onJoined(() => this.setLocalStream())
    // this.peek.onFull(() => this.hangup())
    this.peek.track.subscribe(([streams]) => {
      this.remoteVideo.srcObject = streams
    })
  }

  setLocalStream() {
    navigator.mediaDevices.getUserMedia(env.constraints).then((stream) => {
      this.peek.pc.addStream(stream)
      this.localStream = stream
      this.localVideo.srcObject = null
      this.localVideo.srcObject = stream
      this.localVideo.muted = true
      this.peek.createOffer().then(() => {
        console.log('setLocal')
      })
    })
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

  stop() {
    const tracks = this.localStream.getTracks()
    tracks.forEach((t) => t.stop())
  }

  hangup() {
    console.log('hanup');

    this.stop()
    this.peek.close()
    this._router.navigateByUrl('/')
  }

  ngOnDestroy(): void {
    this.stop()
    this.peek.close()
    this.destroy.next()
    this.destroy.complete()
  }
}
