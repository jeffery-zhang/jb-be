import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MinioModule as MinioModuleLib } from 'nestjs-minio-client'

import { MinioService } from './minio.service'
import { MinioController } from './minio.controller'
import { SettingsModule } from '../settings/settings.module'

@Module({
  imports: [
    MinioModuleLib.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.get('MINIO_HOST'),
        port: Number(configService.get('MINIO_PORT')),
        accessKey: configService.get('MINIO_USER'),
        secretKey: configService.get('MINIO_PWD'),
        useSSL: true,
      }),
      inject: [ConfigService],
    }),
    SettingsModule,
  ],
  providers: [MinioService],
  controllers: [MinioController],
  exports: [MinioService],
})
export class MinioModule {}
