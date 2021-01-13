import { PeerEvent, Signaling } from '@peek/core/model'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { Media } from '@peek/core/model'
import { Component } from '@angular/core'

@Component({ template: '' })
export class Room {
  destroy$ = new Subject<void>()

  protected pc: RTCPeerConnection
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

  selfView: HTMLVideoElement
  remoteView: HTMLVideoElement

  constructor(protected signaling: Signaling, protected media: Media) {}

  start = async () => {
    try {
      if (this.media) {
        this.stream = await this.media.getUserMedia({
          audio: true,
          video: true,
        })
        for (const track of this.stream.getTracks()) {
          this.pc.addTrack(track, this.stream)
        }
        this.selfView.srcObject = this.stream
        this.remoteView.muted = true
        this.selfView.muted = true
      }
    } catch (err) {
      console.error(err)
    }
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

  //  A lógica de negociação perfeita, separada do resto da aplicação
  afterViewComplete() {
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
            // Uma oferta pode chegar enquanto estamos ocupados processando uma resposta.
            // Nesse caso, estaremos "estáveis" no momento em que a oferta for processada
            // Sendo assim, apenas a partir disso devemos seguir com nossas operações.

            const readyForOffer =
              !this.makingOffer &&
              (this.pc.signalingState == 'stable' ||
                this.isSettingRemoteAnswerPending)

            // É uma oferta e não está aguardando nada
            const offerCollision =
              description.type == PeerEvent.Offer && !readyForOffer

            const polite = sender === this.sender

            this.ignoreOffer = polite && offerCollision
            if (this.ignoreOffer) {
              return
            }
            this.isSettingRemoteAnswerPending =
              description.type == PeerEvent.Answer

            await this.pc.setRemoteDescription(description) // SRD reverte conforme necessário

            this.isSettingRemoteAnswerPending = false

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
  }

  hangup() {
    console.log('Ending call')
    this.stream.getTracks().forEach((t) => t.stop())
    if (this.pc) {
      this.pc.close()
      Object.defineProperties(this.pc, {})
    }
  }

  ngOnDestroy() {
    this.hangup()
    this.destroy$.next()
    this.destroy$.complete()
  }
}
