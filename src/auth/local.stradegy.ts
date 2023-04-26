import { Strategy } from 'passport-local'
import { AuthGuard, PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'

import { User } from '../users/schemas/user.schema'

@Injectable()
export class LocalStradegy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super()
  }

  public async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password)
    if (!user) {
      throw new UnauthorizedException('该用户不存在')
    }
    return user
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
