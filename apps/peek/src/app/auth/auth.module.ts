import { PwnedCheckDirective, PwnedMessageComponent } from './pwned'
import { SharedDataAccessModule } from '@peek/shared/data-access'
import { PeekMaterialModule } from '@peek/shared/elements'
import { AuthRoutingModule } from './auth-routing.module'
import { ReactiveFormsModule } from '@angular/forms'
import { AuthComponent } from './auth.component'
import { CommonModule } from '@angular/common'
import { A11yModule } from '@angular/cdk/a11y'
import { NgModule } from '@angular/core'
import { SignInComponent } from './sign-in/sign-in.component'
import { SignUpComponent } from './sign-up/sign-up.component'

@NgModule({
  declarations: [
    AuthComponent,
    PwnedMessageComponent,
    PwnedCheckDirective,
    SignInComponent,
    SignUpComponent,
  ],
  imports: [
    A11yModule,
    CommonModule,
    AuthRoutingModule,
    PeekMaterialModule,
    ReactiveFormsModule,
    SharedDataAccessModule,
  ],
})
export class AuthModule {}
