import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { MeetGuard } from './meet/meet.guard'
import { MeetGateway } from './meet/meet.gateway'

@Module({
  providers: [
    MeetGateway,
    {
      provide: APP_GUARD,
      useClass: MeetGuard,
    },
  ],
})
export class AppModule {}
