import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcrypt'

import { UsersService } from '../users/user.service'
import { RegisterDto } from './dtos/register.dto'
import { User } from 'src/users/schemas/user.schema'
import { encryptPassword } from 'src/shared/utils'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private generateJwt(user: User) {
    const payload = {
      username: user.username,
      sub: user._id,
      roles: user.roles,
    }
    return this.jwtService.sign(payload)
  }

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
    return this.generateJwt(user)
  }

  public async register(registerDto: RegisterDto) {
    const { username, mail } = registerDto
    const valid = await this.userService.validateUsernameAndMail(username, mail)
    if (!valid) return null
    const user = await this.userService.create(registerDto)
    return this.generateJwt(user)
  }

  public async changePwd(id: string, oldPwd: string, newPwd: string) {
    if (!oldPwd || !newPwd) throw new BadRequestException('密码不能为空')
    const user = await this.userService.findOneById(id)
    if (!compareSync(oldPwd, user.password)) {
      throw new ForbiddenException('原密码不正确')
    }
    const password = await encryptPassword(newPwd)
    return await this.userService.update(id, { password })
  }
}
