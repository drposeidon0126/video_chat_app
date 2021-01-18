import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'

@Component({
  selector: 'peek-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent implements OnInit, OnDestroy {
  public value = 0
  public checking = false
  private stream: MediaStream
  private script: ScriptProcessorNode
  private mic: MediaStreamAudioSourceNode

  ngOnInit(): void {
    this.start()
  }

  start() {
    this.checking = true
    const context = new AudioContext()
    const config = { audio: true, video: false }
    navigator.mediaDevices.getUserMedia(config).then((stream) => {
      this.stream = stream
      this.check(context, stream)
    })
  }

  check(context: AudioContext, stream: MediaStream) {
    this.script = context.createScriptProcessor(2048, 1, 1)
    // necessary to make sample run, but should not be.
    this.script.connect(context.destination)
    this.mic = context.createMediaStreamSource(stream)
    this.mic.connect(this.script)

    this.script.addEventListener('audioprocess', (evt) => {
      const input = evt.inputBuffer.getChannelData(0)

      let i: number
      let sum = 0.0
      for (i = 0; i < input.length; i++) {
        sum += input[i] * input[i]
      }

      const value = Math.floor(Math.sqrt(sum / input.length) * 100)
      this.value = value < 50 ? value * 5 : value
      console.log('process', this.value)
    })
  }

  stop() {
    this.checking = false
    this.stream.getTracks().forEach((track) => track.stop())
    this.mic.mediaStream.getTracks().forEach((track) => track.stop())
    this.script.disconnect()
    this.mic.disconnect()
    this.value = 0
  }

  ngOnDestroy(): void {
    this.stop()
  }
}
