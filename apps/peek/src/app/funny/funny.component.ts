import { CreatePeek, GetDevices } from '@peek/core/usecase'
import { ActivatedRoute, Router } from '@angular/router'
import { SocketAdapter } from '@peek/core/adapter'
import { FormControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core'

@Component({
  selector: 'peek-funny',
  templateUrl: './funny.component.html',
  styleUrls: ['./funny.component.scss'],
})
export class FunnyComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('localAudio')
  localAudioRef: ElementRef<HTMLAudioElement>
  localAudio: HTMLAudioElement

  @ViewChild('remoteAudio')
  remoteAudioRef: ElementRef<HTMLAudioElement>
  remoteAudio: HTMLAudioElement

  getDevices = new GetDevices()

  outputControl = new FormControl()

  state: Observable<RTCSignalingState>

  destroy = new Subject<void>()
  localStream: MediaStream
  peek: CreatePeek
  code: string
  constructor(
    private _router: Router,
    socket: SocketAdapter,
    route: ActivatedRoute
  ) {
    const code = route.snapshot.paramMap.get('code')
    if (!code) this._router.navigate(['/'])

    this.peek = new CreatePeek(socket, code)
    this.state = this.peek.state
    this.code = code
  }

  ngOnInit(): void {
    this.getDevices.execute('audiooutput').then((devices) => {
      console.log(devices)
    })
  }

  ngAfterViewInit(): void {
    this.localAudio = this.localAudioRef.nativeElement
    this.remoteAudio = this.remoteAudioRef.nativeElement
    this.peek.onCreated(() => this.setLocalStream())
    this.peek.onJoined(() => this.setLocalStream())
    // this.peek.onFull(() => this.hangup())
    this.peek.track.subscribe(([streams]) => {
      this.remoteAudio.srcObject = streams
    })
  }

  gotStream(stream: MediaStream) {
    console.log(stream)
    this.peek.pc.addStream(stream)
    this.peek.pc.onremovestream = console.log
    this.localStream = stream
    this.localAudio.srcObject = null
    this.localAudio.srcObject = stream
    this.localAudio.muted = true
    this.peek.createOffer().then(() => {
      console.log('setLocal')
    })
  }

  stop() {
    const tracks = this.localStream.getTracks()
    tracks.forEach((t) => t.stop())
  }

  hangup() {
    console.log('hanup')

    // this.stop()
    // this.peek.close()
    this._router.navigateByUrl('/')
  }

  ngOnDestroy(): void {
    this.stop()
    // this.peek.close()
    this.destroy.next()
    this.destroy.complete()
  }

  setLocalStream() {
    // navigator.mediaDevices.getUserMedia(env.constraints).then((stream) => {})
  }
}
