import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Put,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt.stradegy'
import { RegisterDto } from './dtos/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  public async verify(@Request() req) {
    return this.authService.verify(req.user)
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public async login(@Body() body) {
    return this.authService.login({
      username: body.username,
      password: body.password,
    })
  }

  @Post('register')
  public async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @UseGuards(JwtAuthGuard)
  @Put('changePwd')
  public async changePwd(
    @Request() req,
    @Body() body: { oldPwd: string; password: string },
  ) {
    const id = req.user._id
    await this.authService.changePwd(id, body.oldPwd, body.password)
    return { message: '密码修改成功' }
  }
}
