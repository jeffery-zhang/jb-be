import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'

import { SettingsService } from './settings.service'
import { ISearch } from 'src/shared/interfaces'
import { SettingDto } from './dtos/setting.dto'
import { JwtAuthGuard } from 'src/auth/jwt.stradegy'

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async search(@Query() query: ISearch) {
    return await this.settingsService.search(query)
  }

  @Get('getOne')
  async getOne(@Request() req) {
    if (req.user) {
      return await this.settingsService.findOneByUserId(req.user._id)
    }
    return await this.settingsService.findDefault()
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async putOne(@Request() req, dto: SettingDto) {
    return await this.settingsService.putOne(dto, req.user._id)
  }

  @Delete(':id')
  async del(userId: string) {
    await this.settingsService.delete(userId)
    return {
      message: '删除个人设置成功',
    }
  }
}
