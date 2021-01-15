import { Media, PeerEvent, Signaling, uuid } from '@peek/core/model'
import { takeUntil } from 'rxjs/operators'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core'

@Component({
  selector: 'peek-one2one',
  templateUrl: './one2one.component.html',
  styleUrls: ['./one2one.component.scss'],
})
export class One2oneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('selfView') selfViewRef: ElementRef<HTMLVideoElement>
  selfView: HTMLVideoElement

  @ViewChild('remoteView') remoteViewRef: ElementRef<HTMLVideoElement>
  remoteView: HTMLVideoElement

  destroy$ = new Subject<void>()

  active = new Subject<boolean>()
  active$ = this.active.asObservable()

  pc: RTCPeerConnection
  sender: string

  /**
   * ajuda no controle de estado em
   * negociações evitando conflitos
   */
  makingOffer = false
  ignoreOffer = false
  isSettingRemoteAnswerPending = false

  offerOptions: RTCOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  }

  stream: MediaStream

  constructor(
    private router: Router,
    private signaling: Signaling,
    private media: Media
  ) {}

  start = async () => {
    try {
      if (this.media) {
        this.stream = await this.media.getUserMedia()
        for (const track of this.stream.getTracks()) {
          this.pc.addTrack(track, this.stream)
        }
        this.selfView.srcObject = this.stream
        this.selfView.muted = true
      }
    } catch (err) {
      console.error(err)
    }
  }

  restart = async () => {
    this.offerOptions.iceRestart = true
    this.makeOffer(this.offerOptions)
  }

  async makeOffer(options?: RTCOfferOptions) {
    try {
      this.makingOffer = true
      this.pc.createOffer(options).then((offer) => {
        const description = new RTCSessionDescription(offer)

        this.pc.setLocalDescription(description)

        this.signaling.send({ sender: this.sender, description })
      })
    } catch (err) {
      console.error(err)
    } finally {
      this.makingOffer = false
    }
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

    // enviar qualquer candidato de gelo para o outro par
    this.pc.addEventListener('icecandidate', ({ candidate }) => {
      if (candidate) {
        this.signaling.send({ sender: this.sender, candidate })
      }
    })

    // deixe o evento "necessário para a negociação" gerar a oferta
    this.pc.addEventListener('negotiationneeded', async () => {
      this.makeOffer(this.offerOptions)
    })

    this.signaling.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async ({ sender, description, candidate }) => {
        console.log('sender: ', sender)
        try {
          if (description) {
            /**
             * Uma oferta pode chegar enquanto estamos ocupados processando uma resposta.
             * Nesse caso, estaremos "estáveis" no momento em que a oferta for processada
             * Sendo assim, apenas a partir disso devemos seguir com nossas operações.
             */
            const readyForOffer =
              !this.makingOffer &&
              (this.pc.signalingState == 'stable' ||
                this.isSettingRemoteAnswerPending)

            // É uma oferta e não está aguardando nada
            const offerCollision =
              description.type == PeerEvent.Offer && !readyForOffer

            /**
             * Define a política identificando se
             * a resposta veio de outro usuário
             */
            const polite = sender === this.sender

            this.ignoreOffer = polite && offerCollision
            if (this.ignoreOffer) {
              return
            }

            /**
             * Assim que recebermos uma resposta, marcamos como pendente
             * aguardando retorno para a finalizar a conexão entre pares
             */
            this.isSettingRemoteAnswerPending =
              description.type == PeerEvent.Answer

            // O que recebemos de fora sempre será remoto
            await this.pc.setRemoteDescription(description)

            // Revertemos a configuração SRD
            this.isSettingRemoteAnswerPending = false

            // Quando recebermos uma oferta, criamos e enviamos uma resposta
            if (description.type == PeerEvent.Offer) {
              await this.pc.setLocalDescription(await this.pc.createAnswer())
              if (this.pc.localDescription) {
                this.signaling.send({ description: this.pc.localDescription })
              }
            }
          } else if (candidate) {
            try {
              await this.pc.addIceCandidate(candidate)
            } catch (err) {
              if (!this.ignoreOffer) throw err // Suprimir os candidatos da oferta ignorada
            }
          }
        } catch (err) {
          console.error(err)
        }
      })

    this.start()
  }

  hangup() {
    this.router.navigate(['/home'])
  }

  ngOnDestroy() {
    if (this.stream?.active) {
      this.stream.getTracks().forEach((t) => t.stop())
    }
    if (this.signaling?.io.connected) {
      this.signaling.io.disconnect()
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
