import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/user.service'
import { RegisterDto } from './dtos/register.dto'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
}
