import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { AppController } from './app.controller'
import { MeetModule } from './meet/meet.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MeetModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
