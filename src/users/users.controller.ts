import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  UseGuards,
  Put,
} from '@nestjs/common'

import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { RolesGuard } from '../roles/role.guard'
import { Roles } from '../roles/role.decorator'
import { Role } from '../roles/role.enum'
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
  @Put('update')
  async updateUser(@Request() req, @Body() updateDto: UpdateDto) {
    const id = req.user._id
    const valid = await this.userService.validateUsernameAndMail(
      updateDto.username,
      updateDto.mail,
    )
    if (!valid) return null
    const { password, ...rest } = updateDto
    await this.userService.update(id, rest)
    return { message: '用户更新成功' }
  }
}
