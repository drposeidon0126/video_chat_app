import { Module } from '@nestjs/common'
import { AppGateway } from './app/app.gateway'
import { RoomGateway } from './room/room.gateway'

@Module({
  imports: [],
  controllers: [],
  providers: [AppGateway, RoomGateway],
})
export class AppModule {}
