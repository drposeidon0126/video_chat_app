import { InjectionToken } from '@angular/core'
import { Media } from '@peek/core/model'

export function MediaFactory(uri: MediaStreamConstraints) {
  return new Media(uri)
}

export const MEDIA_CONSTRAINTS = new InjectionToken<MediaStreamConstraints>(
  'MediaConstraints'
)
