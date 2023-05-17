import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Cron } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'

import { MinioService } from '../minio/minio.service'
import { Banner } from '../settings/schemas/banner.schema'
import { Post } from '../posts/schemas/post.schema'

@Injectable()
export class ScheduleService {
  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
    @InjectModel(Banner.name) private readonly bannerModel: Model<Banner>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async generateUpdates(
    arr: { _id: any; [key: string]: any }[],
    key: string,
    bucket: string,
  ) {
    const validUrls = arr.filter(
      (item) =>
        item[key] && item[key].includes(this.configService.get('MINIO_HOST')),
    )
    return await Promise.all(
      validUrls.map(async (obj) => {
        const newUrl = await this.minioService.updateLink(obj[key], bucket)
        return {
          ...obj,
          [key]: newUrl,
        }
      }),
    )
  }

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

  async updatePostContentImageUrls(content: string) {
    const reg = /(\!\[.*\])\((.*?)\)/g
    const matches = [...content.matchAll(reg)]
    const newUrls = await Promise.all(
      matches.map(async (match) => {
        return await this.minioService.updateLink(
          match[2],
          this.configService.get('CONTENT_BUCKET'),
        )
      }),
    )
    let contentCopy = content.slice()
    matches.forEach((match, index) => {
      contentCopy = contentCopy.replace(match[2], newUrls[index])
    })

    return contentCopy
  }

  @Cron('0 0 0 * * *')
  async updateBanners() {
    const banners = await this.bannerModel.find().select('bannerUrl').lean()
    const updates = await this.generateUpdates(
      banners,
      'bannerUrl',
      this.configService.get('BANNER_BUCKET'),
    )
    const updateOperations = this.generateUpdateOperations(updates, 'bannerUrl')

    await this.bannerModel.bulkWrite(updateOperations)
    console.log('banner Urls updated')
  }

  @Cron('0 0 0 * * *')
  async updatePoster() {
    const posters = await this.postModel.find().select('poster').lean()
    const updates = await this.generateUpdates(
      posters,
      'poster',
      this.configService.get('POSTER_BUCKET'),
    )
    const updateOperations = this.generateUpdateOperations(updates, 'poster')

    await this.postModel.bulkWrite(updateOperations)
    console.log('posts poster urls updated')
  }

  @Cron('0 0 0 * * *')
  async updateContent() {
    const contents = await this.postModel.find().select('content').lean()
    const updates = await Promise.all(
      contents.map(async (obj) => {
        const newContent = await this.updatePostContentImageUrls(obj.content)
        return {
          ...obj,
          content: newContent,
        }
      }),
    )
    const updateOperations = this.generateUpdateOperations(updates, 'content')

    await this.postModel.bulkWrite(updateOperations)
    console.log('posts content image urls updated')
  }
}
