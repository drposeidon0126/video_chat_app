import { InjectionToken } from '@angular/core'
import { SharedDataAccessConfig } from './shared-data-access-config'

export const SHARED_DATA_ACCESS_CONFIG = new InjectionToken<SharedDataAccessConfig>(
  'SharedDataAccessConfig'
)
