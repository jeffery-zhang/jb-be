import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { RegisterDto } from './dtos/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('currentUser')
  public async currentUser(@Request() req) {
    return req.user
  }

  @Post('register')
  public async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }
}
