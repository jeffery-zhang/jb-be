import { Controller, Get } from '@nestjs/common'

import { UsersService } from './user.service'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll()
  }
}
