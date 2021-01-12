import { InjectionToken } from '@angular/core'
import { Signaling } from '@peek/core/model'

export function SignalingFactory(uri: string) {
  return new Signaling(uri)
}

export const SIGNALING_CLIENT = new InjectionToken<string>('Signaling')
