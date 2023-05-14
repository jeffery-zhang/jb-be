import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { MinioService } from './minio.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { SettingsService } from 'src/settings/settings.service'

@Controller('minio')
export class MinioController {
  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
    private readonly settingsService: SettingsService,
  ) {}

  @Get('client')
  getClient() {
    return this.minioService.client
  }

  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() uploadFile: Express.Multer.File) {
    return await this.minioService.upload(uploadFile)
  }

  @Post('uploadBanner')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBanner(@UploadedFile() uploadFile: Express.Multer.File) {
    const bannerUrl = await this.minioService.upload(
      uploadFile,
      this.configService.get('BANNER_BUCKET'),
    )
    await this.settingsService.addBanner(
      bannerUrl,
      uploadFile.originalname.slice(
        0,
        uploadFile.originalname.lastIndexOf('.'),
      ),
    )
    return bannerUrl
  }

  @Post('uploadAvatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() uploadFile: Express.Multer.File) {
    return await this.minioService.upload(
      uploadFile,
      this.configService.get('AVATAR_BUCKET'),
    )
  }

  @Post('uploadPoster')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPoster(@UploadedFile() uploadFile: Express.Multer.File) {
    return await this.minioService.upload(
      uploadFile,
      this.configService.get('POSTER_BUCKET'),
    )
  }

  @Post('uploadContent')
  @UseInterceptors(FileInterceptor('file'))
  async uploadContent(@UploadedFile() uploadFile: Express.Multer.File) {
    return await this.minioService.upload(
      uploadFile,
      this.configService.get('CONTENT_BUCKET'),
    )
  }
}
