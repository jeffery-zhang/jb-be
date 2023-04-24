import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcrypt'

import { UsersService } from '../users/user.service'
import { RegisterDto } from './dtos/register.dto'
import { User } from 'src/users/schemas/user.schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username)
    if (user) {
      if (!compareSync(pass, user.password)) {
        throw new UnauthorizedException('密码不正确')
      }
      const { password, ...rest } = user
      return rest
    }
    return null
  }

  public async login(user: User) {
    const payload = { username: user.username, sub: user._id }
    return {
      authentication: this.jwtService.sign(payload),
    }
  }

  public async register(registerDto: RegisterDto) {
    const { username, mail } = registerDto
    console.log(await this.userService.findOneByUsername(username))
    if (await this.userService.findOneByUsername(username)) {
      throw new ForbiddenException('用户名已存在')
    } else if (await this.userService.findOneByMail(mail)) {
      throw new ForbiddenException('该邮箱已被注册')
    } else {
      const user = await this.userService.create(registerDto)
      // return this.generateJwt(user.username, user)
      return user
    }
  }
}
