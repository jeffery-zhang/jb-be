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

  private readonly defaultBucket = this.configService.get('DEFAULT_BUCKET')

  get client() {
    return this.minio.client
  }

  async upload(
    file: Express.Multer.File,
    bucket: string = this.defaultBucket,
  ): Promise<string> {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    )
    const tmpFileName = file.originalname
    const ext = tmpFileName.substring(tmpFileName.lastIndexOf('.'))
    const hashFileName = createHash('md5').update(tmpFileName).digest('hex')
    const fileName = `${hashFileName}${ext}`
    return new Promise((resolve) => {
      this.client.putObject(bucket, fileName, file.buffer, async (err) => {
        if (err) {
          console.log(err)
          throw new BadRequestException('上传文件失败')
        }
        const fileUrl = await this.client.presignedUrl(
          'GET',
          bucket,
          fileName,
          7 * 24 * 60 * 60,
        )
        resolve(fileUrl)
      })
    })
  }

  async updateLink(oldUrl: string, bucket: string = this.defaultBucket) {
    const validUrl = () => {
      const baseUrl = `${this.configService.get(
        'MINIO_HOST',
      )}:${this.configService.get('MINIO_PORT')}`
      if (oldUrl.includes(baseUrl)) {
        return true
      }
      return false
    }

    if (!validUrl()) return oldUrl
    const objectName = oldUrl.split('?')[0].split('/').slice(-1)[0]
    const newUrl = await this.client.presignedUrl(
      'GET',
      bucket,
      objectName,
      7 * 24 * 60 * 60,
    )

    return newUrl
  }
}
