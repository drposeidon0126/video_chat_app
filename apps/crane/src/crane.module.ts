import { Module } from '@nestjs/common'
import { CraneGateway } from './crane.gateway'
import { NegotiateGateway } from './negotiate.gateway';

@Module({
  providers: [CraneGateway, NegotiateGateway],
})
export class CraneModule {}
