import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MinioService as MinioServiceLib } from 'nestjs-minio-client'
import { createHash } from 'crypto'

@Injectable()
export class MinioService {
  constructor(
    private readonly configService: ConfigService,
    private readonly minio: MinioServiceLib,
  ) {}

  private readonly bucketName = this.configService.get('MINIO_BUCKET')

  get client() {
    return this.minio.client
  }

  get bucket() {
    return this.bucketName
  }

  async upload(file: Express.Multer.File, bucket: string = this.bucketName) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    )
    const tmpFileName = file.originalname
    const ext = tmpFileName.substring(tmpFileName.lastIndexOf('.'))
    const hashFileName = createHash('md5').update(tmpFileName).digest('hex')
    const fileName = `${hashFileName}${ext}`
    return new Promise((resolve) => {
      this.client.putObject(bucket, fileName, file.buffer, (err) => {
        if (err) {
          console.log(err)
          throw new BadRequestException('上传文件失败')
        }
        const fileUrl = this.client.presignedGetObject(
          this.bucketName,
          fileName,
        )
        resolve(fileUrl)
      })
    })
  }
}
