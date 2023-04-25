import { Controller, Get, Post, Request, Body, UseGuards } from '@nestjs/common'

import { UsersService } from './user.service'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { RolesGuard } from '../roles/role.guard'
import { Roles } from '../roles/role.decorator'
import { Role } from 'src/roles/role.enum'
import { UpdateDto } from './dtos/update.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async findAll() {
    return await this.userService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateUser(@Request() req, @Body() updateDto: UpdateDto) {
    const id = req.user._id
    const valid = await this.userService.validateUsernameAndMail(
      updateDto.username,
      updateDto.mail,
    )
    if (!valid) return null
    const { password, ...rest } = updateDto
    return await this.userService.update(id, rest)
  }
}
