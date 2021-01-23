import { ConfigModule, ConfigService } from '@nestjs/config'
import { HttpModule, Module } from '@nestjs/common'
import { jwtConstants } from './../config/constants'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { httpFactory } from '../config/http'
import { AuthService } from './auth.service'
import { RolesGuard } from './roles.guard'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'

const httpAsync = {
  imports: [ConfigModule],
  useFactory: httpFactory,
  inject: [ConfigService],
}
@Module({
  imports: [
    UsersModule,
    PassportModule,
    HttpModule.registerAsync(httpAsync),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
