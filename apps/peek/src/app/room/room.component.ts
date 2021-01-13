import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core'
import { Subject } from 'rxjs'
import { Room } from './room'
import { Signaling, uuid } from '@peek/core/model'

@Component({
  selector: 'peek-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent extends Room implements AfterViewInit, OnDestroy {
  active = new Subject<boolean>()
  active$ = this.active.asObservable()

  @ViewChild('selfView') selfViewRef: ElementRef<HTMLVideoElement>

  @ViewChild('remoteView') remoteViewRef: ElementRef<HTMLVideoElement>

  constructor(protected signaling: Signaling) {
    super(signaling)
  }

  restart = async () => {
    this.offerOptions.iceRestart = true
    this.makeOffer(this.offerOptions)
  }

  ngAfterViewInit() {
    this.sender = uuid()
    this.selfView = this.selfViewRef.nativeElement
    this.remoteView = this.remoteViewRef.nativeElement

    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.stunprotocol.org:3478' }],
    })

    this.pc.addEventListener('track', ({ track, streams }) => {
      // assim que a mídia remota chegar,
      // mostre-a no elemento de vídeo remoto
      track.addEventListener('unmute', async () => {
        // não defina srcObject caso já esteja definido.
        if (this.remoteView.srcObject) return
        this.remoteView.srcObject = streams[0]
        this.active.next(true)
      })
    })

    this.afterViewComplete()

    this.start()
  }
}
