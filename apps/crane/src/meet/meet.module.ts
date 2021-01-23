import { MeetGateway } from './meet.gateway'
import { APP_GUARD } from '@nestjs/core'
import { MeetGuard } from './meet.guard'
import { Module } from '@nestjs/common'

@Module({
  providers: [
    MeetGateway,
    // {
    //   provide: APP_GUARD,
    //   useClass: MeetGuard,
    // },
  ],
})
export class MeetModule {}
