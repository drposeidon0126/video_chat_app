import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Message, Signaling, uuid } from '@peek/core/model'

export type StateButton = 'call' | 'upgrade' | 'hangup'

@Component({
  selector: 'peek-micro-upgrade',
  templateUrl: './micro-upgrade.component.html',
  styleUrls: ['./micro-upgrade.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroUpgradeComponent implements OnInit, AfterViewInit {
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

  localStream: MediaStream
  pc1: RTCPeerConnection
  pc2: RTCPeerConnection

  offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: false,
  }

  startTime = 0
  sender: string

  constructor(private _signaling: Signaling) {
    this.sender = uuid()
    this.state = {
      call: true,
      upgrade: true,
      hangup: true,
    }
  }

  ngOnInit(): void {
    this._signaling.message$.subscribe(
      ({ sender, description, ...message }) => {
        // console.log('MESSAGE ',message);
        if (sender && sender !== this.sender) {
          console.log('MESSAGE ', description)
        }
      }
    )
  }

  ngAfterViewInit(): void {
    this.localVideo = this.localVideoRef.nativeElement
    this.remoteVideo = this.remoteVideoRef.nativeElement
    this.remoteVideo.onresize = () => {
      console.warn(
        'RESIZE',
        this.remoteVideo.videoWidth,
        this.remoteVideo.videoHeight
      )
      // We'll use the first onsize callback as an indication that video has started
      // playing out.
      if (this.startTime) {
        const elapsedTime = window.performance.now() - this.startTime
        console.log(`Setup time: ${elapsedTime.toFixed(3)}ms`)
        this.startTime = null
      }
    }
    this.start()
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

  getName(pc: RTCPeerConnection) {
    return pc === this.pc1 ? 'pc1' : 'pc2'
  }

  getOtherPc(pc: RTCPeerConnection) {
    return pc === this.pc1 ? this.pc2 : this.pc1
  }
  gotStream(stream: MediaStream) {
    console.log('Received local stream')
    this.localVideo.srcObject = stream
    this.localStream = stream
    this.state = { call: false }
  }

  async start() {
    try {
      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => this.gotStream(stream))
        .then(() => (this.state = { call: false }))
    } catch (e) {
      console.log(`getUserMedia() error: ${e.name}`)
    }
  }

  call() {
    this.state = {
      call: true,
      upgrade: false,
      hangup: false,
    }

    console.log('Starting call')
    this.startTime = window.performance.now()
    const audioTracks = this.localStream.getAudioTracks()
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`)
    }
    const servers = null
    this.pc1 = new RTCPeerConnection(servers)
    console.log('Created local peer connection object pc1')
    this.pc1.onicecandidate = (e) => this.onIceCandidate(this.pc1, e)
    this.pc2 = new RTCPeerConnection(servers)
    console.log('Created remote peer connection object pc2')
    this.pc2.onicecandidate = (e) => this.onIceCandidate(this.pc2, e)
    this.pc1.oniceconnectionstatechange = (e) => {
      this.onIceStateChange(this.pc1, e)
    }
    this.pc2.oniceconnectionstatechange = (e) => {
      this.onIceStateChange(this.pc2, e)
    }
    this.pc2.ontrack = this.gotRemoteStream

    this.localStream.getTracks().forEach((track) => {
      this.pc1.addTrack(track, this.localStream)
    })
    console.log('Added local stream to pc1')

    console.log('pc1 createOffer start')
    this.pc1
      .createOffer(this.offerOptions)
      .then(this.onCreateOfferSuccess)
      .catch(this.onCreateSessionDescriptionError)
  }

  onCreateSessionDescriptionError(error: Error) {
    console.log(`Failed to create session description: ${error.toString()}`)
  }

  onCreateOfferSuccess = (desc: RTCSessionDescriptionInit) => {
    console.log(`Offer from pc1\n${desc.sdp}`)
    console.log('pc1 setLocalDescription start')
    this.pc1
      .setLocalDescription(desc)
      .then(() => {
        this._signaling.send({
          sender: this.sender,
          description: this.pc1.localDescription,
        })
        this.onSetLocalSuccess(this.pc1)
      })
      .catch(this.onSetSessionDescriptionError)

    console.log('pc2 setRemoteDescription start')
    this.pc2
      .setRemoteDescription(desc)
      .then(() => this.onSetRemoteSuccess(this.pc2))
      .catch(this.onSetSessionDescriptionError)
    console.log('pc2 createAnswer start')
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    this.pc2
      .createAnswer()
      .then(this.onCreateAnswerSuccess)
      .catch(this.onCreateSessionDescriptionError)
  }

  onSetLocalSuccess(pc: RTCPeerConnection) {
    console.log(`${this.getName(pc)} setLocalDescription complete`)
  }

  onSetRemoteSuccess(pc: RTCPeerConnection) {
    console.log(`${this.getName(pc)} setRemoteDescription complete`)
  }

  onSetSessionDescriptionError(error: Error) {
    console.log(`Failed to set session description: ${error.toString()}`)
  }

  gotRemoteStream = (e: RTCTrackEvent) => {
    console.log('gotRemoteStream', e.track, e.streams[0])

    // reset srcObject to work around minor bugs in Chrome and Edge.
    this.remoteVideo.srcObject = null
    this.remoteVideo.srcObject = e.streams[0]
  }

  onCreateAnswerSuccess = (desc: RTCSessionDescriptionInit) => {
    console.log(`Answer from pc2: ${desc.sdp}`)
    console.log('pc2 setLocalDescription start')
    this.pc2
      .setLocalDescription(desc)
      .then(
        () => this.onSetLocalSuccess(this.pc2),
        this.onSetSessionDescriptionError
      )

    console.log('pc1 setRemoteDescription start')
    this.pc1
      .setRemoteDescription(desc)
      .then(
        () => this.onSetRemoteSuccess(this.pc1),
        this.onSetSessionDescriptionError
      )
  }

  onIceCandidate(pc: RTCPeerConnection, event: RTCPeerConnectionIceEvent) {
    this.getOtherPc(pc)
      .addIceCandidate(event.candidate)
      .then(
        () => this.onAddIceCandidateSuccess(pc),
        (err) => this.onAddIceCandidateError(pc, err)
      )

    console.log(
      `${this.getName(pc)} ICE candidate:\n${
        event.candidate ? event.candidate.candidate : '(null)'
      }`
    )
  }

  onAddIceCandidateSuccess(pc: RTCPeerConnection) {
    console.log(`${this.getName(pc)} addIceCandidate success`)
  }

  onAddIceCandidateError(pc: RTCPeerConnection, error: Error) {
    console.log(
      `${this.getName(pc)} failed to add ICE Candidate: ${error.toString()}`
    )
  }

  onIceStateChange(pc: RTCPeerConnection, event: Event) {
    if (pc) {
      console.log(`${this.getName(pc)} ICE state: ${pc.iceConnectionState}`)
      console.log('ICE state change event: ', event)
    }
  }

  upgrade() {
    this.state = { upgrade: true }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const videoTracks = stream.getVideoTracks()
        if (videoTracks.length > 0) {
          console.log(`Using video device: ${videoTracks[0].label}`)
        }
        this.localStream.addTrack(videoTracks[0])

        this.localVideo.srcObject = null
        this.localVideo.srcObject = this.localStream

        this.pc1.addTrack(videoTracks[0], this.localStream)

        return this.pc1.createOffer()
      })
      .then((o) => this.pc1.setLocalDescription(o))

      .then(() => this.pc2.setRemoteDescription(this.pc1.localDescription))

      .then(() => this.pc2.createAnswer())
      .then((a) => this.pc2.setLocalDescription(a))

      .then(() => this.pc1.setRemoteDescription(this.pc2.localDescription))
  }

  hangup() {
    console.log('Ending call')
    this.pc1.close()
    this.pc2.close()
    this.pc1 = null
    this.pc2 = null

    const videoTracks = this.localStream.getVideoTracks()
    videoTracks.forEach((videoTrack) => {
      videoTrack.stop()
      this.localStream.removeTrack(videoTrack)
    })
    this.localVideo.srcObject = null
    this.localVideo.srcObject = this.localStream

    this.state = { hangup: true, call: false }
  }
}
