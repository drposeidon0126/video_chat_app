import { BehaviorSubject, Subject } from 'rxjs'
import { FormControl } from '@angular/forms'
import { takeUntil } from 'rxjs/operators'
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core'

@Component({
  selector: 'peek-wave',
  templateUrl: './wave.component.html',
  styleUrls: ['./wave.component.scss'],
})
export class WaveComponent implements AfterViewInit, OnDestroy {
  @ViewChild('theCanvas')
  private _canvas: ElementRef<HTMLCanvasElement>
  canvas: HTMLCanvasElement

  private _audio = new BehaviorSubject<boolean>(true)
  audio = this._audio.asObservable()

  destroy = new Subject<void>()

  audioContext: AudioContext
  mediaStreamSource: MediaStreamAudioSourceNode
  delay: DelayNode
  jungle: Jungle

  shiftSlider = new FormControl(1)

  canvasContext: CanvasRenderingContext2D

  dataArray: Uint8Array
  analyser: AnalyserNode

  @Input() color = 'rgba(18, 18, 18, 1)'
  analyserMethod = 'getByteTimeDomainData'

  @Output() onStream = new EventEmitter<MediaStream>()

  ngAfterViewInit(): void {
    this.canvas = this._canvas.nativeElement
    if (this.canvas) {
      this.canvasContext = this.canvas.getContext('2d')
    }

    this.audioContext = new AudioContext()

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => this.gotStream(stream))
      .catch((error) => this.error(error))
  }

  gotStream = (stream: MediaStream) => {
    this.onStream.emit(stream)
    if (this.audioContext === null) {
      this.audioContext = new AudioContext()
    }
    this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream)

    this.analyser = this.audioContext.createAnalyser()
    this.delay = this.audioContext.createDelay()
    this.delay.delayTime.value = 0

    this.mediaStreamSource.connect(this.delay)

    this.jungle = new Jungle(this.audioContext)
    this.jungle.setPitchOffset(1.6)

    this.delay.connect(this.jungle.input)
    this.jungle.output.connect(this.audioContext.destination)
    this.jungle.output.connect(this.analyser)

    this.shiftSlider.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => {
        this.jungle.setPitchOffset(value)
      })

    this.startDrawing()
  }

  error = (message: Error) => {
    console.log(message)
  }

  startDrawing() {
    this.analyser.fftSize = 2048
    const bufferLength = this.analyser.frequencyBinCount
    this.dataArray = new Uint8Array(bufferLength)
    this.canvasContext.lineWidth = 1
    this.canvasContext.strokeStyle = this.color
    const drawAgain = () => {
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
      requestAnimationFrame(drawAgain)
      this.analyser[this.analyserMethod](this.dataArray)
      for (var i = 0; i < bufferLength; i++) {
        this.canvasContext.beginPath()
        this.canvasContext.moveTo(i, 255)
        this.canvasContext.lineTo(i, 255 - this.dataArray[i])
        this.canvasContext.closePath()
        this.canvasContext.stroke()
      }
    }

    drawAgain()
  }

  toggleAudio() {
    const enabled = !this._audio.getValue()
    const stream = this.mediaStreamSource.mediaStream
    stream.getTracks().forEach((t) => (t.enabled = enabled))
    this._audio.next(enabled)
  }

  ngOnDestroy(): void {
    this.destroy.next()
    this.destroy.complete()
    const stream = this.mediaStreamSource.mediaStream
    stream.getTracks().forEach((t) => t.stop())
  }
}

export class Jungle {
  input: GainNode
  output: GainNode

  shiftDownBuffer: AudioBuffer
  shiftUpBuffer: AudioBuffer

  mod1: AudioBufferSourceNode
  mod2: AudioBufferSourceNode
  mod1Gain: GainNode
  mod2Gain: GainNode
  mod3Gain: GainNode
  mod4Gain: GainNode
  modGain1: GainNode
  modGain2: GainNode
  fade1: AudioBufferSourceNode
  fade2: AudioBufferSourceNode
  mix1: GainNode
  mix2: GainNode
  delay1: DelayNode
  delay2: DelayNode

  constructor(
    public context: AudioContext,
    public bufferTime: number = 0.1,
    public fadeTime: number = 0.05,
    public delayTime: number = 0.1
  ) {
    // this.context = context
    // Create nodes for the input and output of this "module".
    var input = context.createGain()
    var output = context.createGain()
    this.input = input
    this.output = output

    // Delay modulation.
    var mod1 = context.createBufferSource()
    var mod2 = context.createBufferSource()
    var mod3 = context.createBufferSource()
    var mod4 = context.createBufferSource()
    this.shiftDownBuffer = createDelayTimeBuffer(
      context,
      bufferTime,
      fadeTime,
      false
    )
    this.shiftUpBuffer = createDelayTimeBuffer(
      context,
      bufferTime,
      fadeTime,
      true
    )
    mod1.buffer = this.shiftDownBuffer
    mod2.buffer = this.shiftDownBuffer
    mod3.buffer = this.shiftUpBuffer
    mod4.buffer = this.shiftUpBuffer
    mod1.loop = true
    mod2.loop = true
    mod3.loop = true
    mod4.loop = true

    // for switching between oct-up and oct-down
    var mod1Gain = context.createGain()
    var mod2Gain = context.createGain()
    var mod3Gain = context.createGain()
    mod3Gain.gain.value = 0
    var mod4Gain = context.createGain()
    mod4Gain.gain.value = 0

    mod1.connect(mod1Gain)
    mod2.connect(mod2Gain)
    mod3.connect(mod3Gain)
    mod4.connect(mod4Gain)

    // Delay amount for changing pitch.
    var modGain1 = context.createGain()
    var modGain2 = context.createGain()

    var delay1 = context.createDelay()
    var delay2 = context.createDelay()
    mod1Gain.connect(modGain1)
    mod2Gain.connect(modGain2)
    mod3Gain.connect(modGain1)
    mod4Gain.connect(modGain2)
    modGain1.connect(delay1.delayTime)
    modGain2.connect(delay2.delayTime)

    // Crossfading.
    var fade1 = context.createBufferSource()
    var fade2 = context.createBufferSource()
    var fadeBuffer = createFadeBuffer(context, bufferTime, fadeTime)
    fade1.buffer = fadeBuffer
    fade2.buffer = fadeBuffer
    fade1.loop = true
    fade2.loop = true

    var mix1 = context.createGain()
    var mix2 = context.createGain()
    mix1.gain.value = 0
    mix2.gain.value = 0

    fade1.connect(mix1.gain)
    fade2.connect(mix2.gain)

    // Connect processing graph.
    input.connect(delay1)
    input.connect(delay2)
    delay1.connect(mix1)
    delay2.connect(mix2)
    mix1.connect(output)
    mix2.connect(output)

    // Start
    let t = context.currentTime + 0.05
    let t2 = t + bufferTime - fadeTime
    mod1.start(t)
    mod2.start(t2)
    mod3.start(t)
    mod4.start(t2)
    fade1.start(t)
    fade2.start(t2)

    this.mod1 = mod1
    this.mod2 = mod2
    this.mod1Gain = mod1Gain
    this.mod2Gain = mod2Gain
    this.mod3Gain = mod3Gain
    this.mod4Gain = mod4Gain
    this.modGain1 = modGain1
    this.modGain2 = modGain2
    this.fade1 = fade1
    this.fade2 = fade2
    this.mix1 = mix1
    this.mix2 = mix2
    this.delay1 = delay1
    this.delay2 = delay2

    this.setDelay(delayTime)
  }
  setDelay(delayTime: number) {
    this.modGain1.gain.setTargetAtTime(0.5 * delayTime, 0, 0.01)
    this.modGain2.gain.setTargetAtTime(0.5 * delayTime, 0, 0.01)
  }
  setPitchOffset(mult: number) {
    if (mult > 0) {
      // pitch up
      this.mod1Gain.gain.value = 0
      this.mod2Gain.gain.value = 0
      this.mod3Gain.gain.value = 1
      this.mod4Gain.gain.value = 1
    } else {
      // pitch down
      this.mod1Gain.gain.value = 1
      this.mod2Gain.gain.value = 1
      this.mod3Gain.gain.value = 0
      this.mod4Gain.gain.value = 0
    }
    this.setDelay(this.delayTime * Math.abs(mult))
  }
}

function createFadeBuffer(
  context: AudioContext,
  activeTime: number,
  fadeTime: number
) {
  const length1 = activeTime * context.sampleRate
  const length2 = (activeTime - 2 * fadeTime) * context.sampleRate
  const length = length1 + length2
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const p = buffer.getChannelData(0)

  const fadeLength = fadeTime * context.sampleRate

  const fadeIndex1 = fadeLength
  const fadeIndex2 = length1 - fadeLength

  // 1st part of cycle
  for (let i = 0; i < length1; ++i) {
    let value: number

    if (i < fadeIndex1) {
      value = Math.sqrt(i / fadeLength)
    } else if (i >= fadeIndex2) {
      value = Math.sqrt(1 - (i - fadeIndex2) / fadeLength)
    } else {
      value = 1
    }

    p[i] = value
  }

  // 2nd part
  for (let i = length1; i < length; ++i) {
    p[i] = 0
  }

  return buffer
}

function createDelayTimeBuffer(
  context: AudioContext,
  activeTime: number,
  fadeTime: number,
  shiftUp: boolean
) {
  const length1 = activeTime * context.sampleRate
  const length2 = (activeTime - 2 * fadeTime) * context.sampleRate
  const length = length1 + length2
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const p = buffer.getChannelData(0)

  // 1st part of cycle
  for (let i = 0; i < length1; ++i) {
    if (shiftUp)
      // This line does shift-up transpose
      p[i] = (length1 - i) / length
    // This line does shift-down transpose
    else p[i] = i / length1
  }

  // 2nd part
  for (let i = length1; i < length; ++i) {
    p[i] = 0
  }

  return buffer
}
