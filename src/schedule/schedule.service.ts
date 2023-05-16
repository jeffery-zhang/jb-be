import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ObjectId } from 'mongoose'
import { Cron } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'

import { MinioService } from '../minio/minio.service'
import { Banner } from '../settings/schemas/banner.schema'
import { Post } from '../posts/schemas/post.schema'
import { updatePostContentImage } from '../shared/utils'

@Injectable()
export class ScheduleService {
  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
    @InjectModel(Banner.name) private readonly bannerModel: Model<Banner>,
    @InjectModel('Post') private readonly postModel: Model<Post>,
  ) {}

  generateUpdateOperations(
    updates: { _id: any; [key: string]: any }[],
    key: string,
  ) {
    return updates.map((update) => ({
      updateOne: {
        filter: { _id: update._id },
        update: {
          $set: { [key]: update[key] },
        },
      },
    }))
  }

  @Cron('0 0 0 * * *')
  async updateBanners() {
    const banners = await this.bannerModel.find().select('bannerUrl').lean()
    const validUrls = banners.filter(
      (b) =>
        b.bannerUrl &&
        b.bannerUrl.includes(this.configService.get('MINIO_HOST')),
    )
    const updates = await Promise.all(
      validUrls.map(async (obj) => {
        const newUrl = await this.minioService.updateLink(
          obj.bannerUrl,
          this.configService.get('BANNER_BUCKET'),
        )
        return {
          ...obj,
          bannerUrl: newUrl,
        }
      }),
    )
    const updateOperations = this.generateUpdateOperations(
      updates,
      this.configService.get('BANNER_BUCKET'),
    )

    await this.bannerModel.bulkWrite(updateOperations)
    console.log('bannerUrls updated')
  }

  @Cron('0 0 0 * * *')
  async updatePoster() {
    const posters = await this.postModel.find().select('poster').lean()
    const validUrls = posters.filter(
      (p) =>
        p.poster && p.poster.includes(this.configService.get('MINIO_HOST')),
    )

    const updates = await Promise.all(
      validUrls.map(async (obj) => {
        const newUrl = await this.minioService.updateLink(
          obj.poster,
          this.configService.get('POSTER_BUCKET'),
        )
        return {
          ...obj,
          poster: newUrl,
        }
      }),
    )
    const updateOperations = this.generateUpdateOperations(
      updates,
      this.configService.get('POSTER_BUCKET'),
    )

    await this.postModel.bulkWrite(updateOperations)
    console.log('post module poster urls updated')
  }

  @Cron('0 0 0 * * *')
  async updateContent() {
    const contents = await this.postModel.find().select('content').lean()
    const updates = await Promise.all(
      contents.map(async (obj) => {
        const reg = /(\!\[.*\])\((.*?)\)/g
        const newContent = await updatePostContentImage(
          obj.content,
          reg,
          this.minioService.updateLink.bind(this.minioService),
          this.configService.get('CONTENT_BUCKET'),
        )
        return {
          ...obj,
          content: newContent,
        }
      }),
    )
    const updateOperations = this.generateUpdateOperations(
      updates,
      this.configService.get('CONTENT_BUCKET'),
    )

    await this.postModel.bulkWrite(updateOperations)
    console.log('post module content image urls updated')
  }
}
