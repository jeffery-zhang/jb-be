import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
  Post,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common'

import { SettingsService } from './settings.service'
import { ISearch } from 'src/shared/interfaces'
import { SettingDto } from './dtos/setting.dto'
import { JwtAuthGuard } from 'src/auth/jwt.stradegy'
import { BannerDto } from './dtos/banner.dto'

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async search(@Query() query: ISearch) {
    return await this.settingsService.search(query)
  }

  @UseGuards(JwtAuthGuard)
  @Get('getOne')
  async getOne(@Request() req) {
    console.log('get setting: ', req.user)
    if (req.user) {
      return await this.settingsService.findOneByUserId(req.user._id)
    }
    return await this.settingsService.findDefault()
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async putOne(@Request() req, @Body() dto: SettingDto) {
    return await this.settingsService.putOne(dto, req.user._id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async del(@Param('id') id: string) {
    await this.settingsService.delete(id)
    return {
      message: '删除个人设置成功',
    }
  }

  @Get('themes')
  getAllThemes() {
    return this.settingsService.getAllThemes()
  }

  @Get('banners')
  async getAllBanners() {
    return await this.settingsService.getAllBanners()
  }

  @Post('banners')
  async addBanner(@Body() dto: BannerDto) {
    await this.settingsService.addBanner(dto.bannerUrl, dto.name)
    return {
      message: '添加banner成功',
    }
  }

  @Delete('banners/:id')
  async deleteBanner(@Param('id') id: string) {
    await this.settingsService.deleteBanner(id)
    return {
      message: '删除banner成功',
    }
  }
}
