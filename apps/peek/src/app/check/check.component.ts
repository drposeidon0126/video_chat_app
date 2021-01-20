import { Component, OnDestroy, AfterViewInit } from '@angular/core'

@Component({
  selector: 'peek-check',
  template: `
    <mat-progress-bar mode="determinate" [value]="value"> </mat-progress-bar>
    <h1 class="mat-h1">{{ value }}</h1>
  `,
  styles: [
    `
      :host {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .mat-h1 {
        text-align: center;
        margin: 12px 0 0;
      }
    `,
  ],
})
export class CheckComponent implements AfterViewInit, OnDestroy {
  public value = 0
  public checking = false
  private stream: MediaStream
  private script: ScriptProcessorNode
  private mic: MediaStreamAudioSourceNode

  ngAfterViewInit(): void {
    const context = new AudioContext()
    const config = { audio: true, video: false }
    navigator.mediaDevices.getUserMedia(config).then((stream) => {
      this.stream = stream
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
    })
  }

  ngOnDestroy(): void {
    this.stream.getTracks().forEach((track) => track.stop())
    this.mic.mediaStream.getTracks().forEach((track) => track.stop())
    this.script.disconnect()
    this.mic.disconnect()
    this.value = 0
  }
}
