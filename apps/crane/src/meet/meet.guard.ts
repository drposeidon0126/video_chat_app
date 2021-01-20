import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { PeekPayload } from '@peek/core/model'
import { Observable } from 'rxjs'

@Injectable()
export class MeetGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.hasCode(context.switchToWs().getData())
  }

  hasCode({ code }: PeekPayload) {
    if (!code) throw new WsException('Missing code.')
    return !!code
  }
}
