import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service'
import { Roles } from './auth/roles.decorator'
import { Public } from './config/public'
import { Role } from '@peek/core/entity'

type Req = Request & { user }

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: Req) {
    return this.authService.login(req.user)
  }

  // @Public()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: Req) {
    return req.user
  }

  @Public()
  @Post('auth/check')
  check(@Body() { hash }: { hash: string }) {
    console.log(hash)

    return this.authService.pwned(hash)
  }
}
