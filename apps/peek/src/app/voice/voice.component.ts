import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { WebSocketFacade } from '@peek/core/adapter'
import { CreatePeek } from '@peek/core/usecase'
import { ActivatedRoute, Router } from '@angular/router'
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core'

@Component({
  selector: 'peek-voice',
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.scss'],
})
export class VoiceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('localAudio')
  localAudioRef: ElementRef<HTMLAudioElement>
  localAudio: HTMLAudioElement

  @ViewChild('remoteAudio')
  remoteAudioRef: ElementRef<HTMLAudioElement>
  remoteAudio: HTMLAudioElement

  private _audio = new BehaviorSubject<boolean>(true)
  audio = this._audio.asObservable()

  state: Observable<RTCSignalingState>

  destroy = new Subject<void>()
  localStream: MediaStream
  peek: CreatePeek
  code: string
  constructor(
    private _router: Router,
    socket: WebSocketFacade,
    route: ActivatedRoute
  ) {
    const code = route.snapshot.paramMap.get('code')
    if (!code) this._router.navigate(['/'])

    this.peek = new CreatePeek(socket, code)
    this.state = this.peek.state
    this.code = code
  }

  ngAfterViewInit(): void {
    this.localAudio = this.localAudioRef.nativeElement
    this.remoteAudio = this.remoteAudioRef.nativeElement
  }

  gotLocalStream(stream: MediaStream) {
    this.setLocalStream(stream)
    this.peek.onCreated(() => this.setLocalStream(stream))
    this.peek.onJoined(() => this.setLocalStream(stream))
    // this.peek.onFull(() => this.hangup())
    this.peek.track.subscribe(([streams]) => {
      this.remoteAudio.srcObject = streams
    })
  }

  setLocalStream(stream: MediaStream) {
    this.peek.pc.addStream(stream)
    this.peek.pc.onremovestream = console.log
    this.localStream = stream
    this.localAudio.srcObject = null
    this.localAudio.srcObject = stream
    this.localAudio.muted = true
    this.peek.createOffer().then(() => {
      console.log('offer');
    })
  }

  toggleAudio() {
    const enabled = !this._audio.getValue()
    const tracks = this.localStream.getAudioTracks()
    tracks.forEach((t) => (t.enabled = enabled))
    this._audio.next(enabled)
  }

  stop() {
    const tracks = this.localStream.getTracks()
    tracks.forEach((t) => t.stop())
  }

  hangup() {
    console.log('hanup')

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
