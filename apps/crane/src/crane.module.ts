import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { MeetGuard } from './meet/meet.guard'
import { CraneGateway } from './crane.gateway'
import { MeetGateway } from './meet/meet.gateway'

@Module({
  providers: [
    // CraneGateway,
    MeetGateway,
    {
      provide: APP_GUARD,
      useClass: MeetGuard,
    },
  ],
})
export class CraneModule {}
