import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SettingsService } from './settings.service'
import { SettingsController } from './settings.controller'
import { Setting, SettingSchema } from './schemas/setting.schema'
import { Banner, BannerSchema } from './schemas/banner.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Setting.name, schema: SettingSchema },
      { name: Banner.name, schema: BannerSchema },
    ]),
  ],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
