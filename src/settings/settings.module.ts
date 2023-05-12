import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SettingsService } from './settings.service'
import { SettingsController } from './settings.controller'
import { SettingSchema } from './schemas/setting.schema'
import { MinioModule } from '../minio/minio.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Setting', schema: SettingSchema }]),
    MinioModule,
  ],
  providers: [SettingsService],
  controllers: [SettingsController],
})
export class SettingsModule {}
