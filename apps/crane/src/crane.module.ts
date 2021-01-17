import { Module } from '@nestjs/common'
import { CraneGateway } from './crane.gateway'

@Module({
  providers: [CraneGateway],
})
export class CraneModule {}
