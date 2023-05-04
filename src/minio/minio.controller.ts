import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { MinioService } from './minio.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Get('client')
  getClient() {
    return this.minioService.bucket
  }

  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() uploadFile: Express.Multer.File) {
    return await this.minioService.upload(uploadFile)
  }
}
