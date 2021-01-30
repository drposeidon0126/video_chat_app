import { SHARED_DATA_ACCESS_CONFIG } from './shared-data-access-injectors'
import { SharedDataAccessConfig } from './shared-data-access-config'
import { IdentityStorage } from './storage/identity.storage'
import { AuthDataService } from './infra/auth-data.service'
import { HttpService } from './http/http.service'
import { AuthFacade } from './app/auth.facade'
import { NgModule } from '@angular/core'

@NgModule({
  providers: [
    HttpService,
    IdentityStorage,
    AuthDataService,
    AuthFacade,
    { provide: SHARED_DATA_ACCESS_CONFIG, useClass: SharedDataAccessConfig },
  ],
})
export class SharedDataAccessModule {}
