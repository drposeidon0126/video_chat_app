import { BehaviorSubject, Subject } from 'rxjs'
import { getDevices, getUserMedia } from './util/media'

export class UserMedia {
  private _devices = new BehaviorSubject<MediaDeviceInfo[]>([])
  devices$ = this._devices.asObservable()

  private _stream = new Subject<MediaStream>()
  stream$ = this._stream.asObservable()

  private _currentStream!: MediaStream
  public get currentStream(): MediaStream {
    return this._currentStream
  }
  public set currentStream(value: MediaStream) {
    this._currentStream = value
  }

  loadUserMedia(constraints?: MediaStreamConstraints): void {
    getUserMedia(constraints).then((stream) => {
      this.currentStream = stream
      this._stream.next(stream)
    })
  }

  loadDevices(deviceKind?: MediaDeviceKind): void {
    getDevices(deviceKind).then((devices) => {
      this._devices.next(devices)
    })
  }

  loadDisplayMedia(): void {
    const config = { video: true, audio: true }
    const mediaDevices = navigator.mediaDevices

    const setStream = (stream: MediaStream) => {
      this._stream.next(stream)
      this.currentStream = stream
    }

    if ('getDisplayMedia' in navigator) {
      ;(navigator as any).getDisplayMedia(config).then(setStream)
    } else if ('getDisplayMedia' in mediaDevices) {
      ;(mediaDevices as any).getDisplayMedia(config).then(setStream)
    } else {
      mediaDevices
        .getUserMedia({
          video: { mediaSourcee: 'screen' },
          audio: true,
        } as MediaStreamConstraints)
        .then(setStream)
    }
  }
}
