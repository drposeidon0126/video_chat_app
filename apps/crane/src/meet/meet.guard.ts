import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { IS_PUBLIC_KEY } from './../config/public'
import { WsException } from '@nestjs/websockets'
import { PeekPayload } from '@peek/core/model'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'

@Injectable()
export class MeetGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    return this.hasCode(context.switchToWs().getData())
  }

  hasCode({ code }: PeekPayload) {
    if (!code) throw new WsException('Missing code.')
    return !!code
  }
}
