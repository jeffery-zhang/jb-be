import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt.stradegy'
import { RegisterDto } from './dtos/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('currentUser')
  public async currentUser(@Request() req) {
    return req.user
  }

  @Post('register')
  public async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('changePwd')
  public async changePwd(
    @Request() req,
    @Body() body: { oldPwd: string; password: string },
  ) {
    const id = req.user._id
    return this.authService.changePwd(id, body.oldPwd, body.password)
  }
}
