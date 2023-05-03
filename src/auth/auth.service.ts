import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcrypt'

import { UsersService } from '../users/users.service'
import { RegisterDto } from './dtos/register.dto'
import { User } from '../users/schemas/user.schema'
import { encryptPassword } from '../shared/utils'

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
        throw new BadRequestException('密码不正确')
      }
      const { password, ...rest } = user
      return rest
    }
    return null
  }

  public async verify(user: any) {
    const verified = await this.userService.findOneById(user._id)
    if (!verified) return null
    return {
      id: verified._id,
      username: verified.username,
      mail: verified.mail,
      avatar: verified.avatar,
    }
  }

  public async login(body: { username: string; password: string }) {
    const user = await this.validateUser(body.username, body.password)
    const { _id, username, mail, avatar } = user
    return {
      token: this.generateJwt(user),
      id: _id,
      username,
      mail,
      avatar,
    }
  }

  public async register(registerDto: RegisterDto) {
    const { username, mail, avatar } = registerDto
    const valid = await this.userService.validateUsernameAndMail(username, mail)
    if (!valid) return null
    const user = await this.userService.create(registerDto)
    return {
      token: this.generateJwt(user),
      id: user._id,
      username,
      mail,
      avatar,
    }
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
