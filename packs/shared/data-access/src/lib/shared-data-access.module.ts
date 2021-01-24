import { IdentityStorage } from './storage/identity.storage'
import { AuthDataService } from './infra/auth-data.service'
import { NgModule } from '@angular/core'
import { AuthFacade } from './app/auth.facade'

@NgModule({
  providers: [IdentityStorage, AuthDataService, AuthFacade],
})
export class SharedDataAccessModule {}
