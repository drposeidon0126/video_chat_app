import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { WebSocketFacade } from '@peek/core/adapter'
import { CreatePeek } from '@peek/core/usecase'
import { Router } from '@angular/router'
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

  constructor(private _socket: WebSocketFacade, private _router: Router) {
    this.peek = new CreatePeek(_socket)
    this.state = this.peek.state
  }

  ngAfterViewInit(): void {
    this.localVideo = this.localVideoRef.nativeElement
    this.remoteVideo = this.remoteVideoRef.nativeElement
    this.peek.track.subscribe(([streams]) => {
      this.remoteVideo.srcObject = streams
    })
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
    this.stop()
    this.peek.close()
    this._router.navigateByUrl('/')
  }

  ngOnDestroy(): void {
    this.peek.close()
    this.destroy.next()
    this.destroy.complete()
  }
}
