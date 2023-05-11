import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Cron } from '@nestjs/schedule'

import { Post } from './schemas/post.schema'
import { ISearchPostParams } from './interfaces/search-post.interface'
import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'
import { IReponseRecords } from '../shared/interfaces'
import { filterSearchParams } from '../shared/utils'
import { CategoriesService } from '../categories/categories.service'
import { ConfigService } from '@nestjs/config'
import { MinioService } from '../minio/minio.service'
import { updatePostContentImage } from '../shared/utils'

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    private readonly categoriesService: CategoriesService,
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
  ) {
    // this.updatePoster()
    // this.updateContent()
  }

  async getPostsCount() {
    return await this.postModel.estimatedDocumentCount()
  }

  async getAllIds() {
    return await this.postModel.find().select('_id').lean()
  }

  async search(params: ISearchPostParams): Promise<IReponseRecords<Post>> {
    const { conditions, pager, sorter } = filterSearchParams(params)
    // 根据搜索关键词进行匹配
    params.keywords &&
      (conditions['$or'] = [
        { title: { $regex: new RegExp(params.keywords, 'i') } },
        { intro: { $regex: new RegExp(params.keywords, 'i') } },
      ])

    // 匹配所有包含某个标签的文档
    conditions.tags && (conditions.tags = { $in: [params.tags] })

    const query = this.postModel
      .find(conditions)
      .skip(pager.skipCount)
      .limit(pager.pageSize)
      .sort(sorter)

    const result = await query.select('-content').exec()
    const total = await this.getPostsCount()

    return {
      page: pager.page,
      pageSize: pager.pageSize,
      total,
      records: result,
    }
  }

  async findOneById(id: string) {
    return this.postModel.findById(id)
  }

  async create(userId: string, username: string, createPostDto: CreatePostDto) {
    return await this.postModel.create({
      ...createPostDto,
      userId,
      username,
    })
  }

  async update(updatePostDto: UpdatePostDto) {
    const updateTime = new Date()
    return await this.postModel.findByIdAndUpdate(updatePostDto.id, {
      ...updatePostDto,
      updateTime,
    })
  }

  async delete(id: string) {
    return await this.postModel.findByIdAndDelete(id)
  }

  async increasePv(id: string) {
    return await this.postModel.findOneAndUpdate(
      { _id: id },
      { $inc: { pv: 1 } },
      { new: true },
    )
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
        const newUrl = await this.minioService.updateLink(obj.poster)
        return {
          ...obj,
          poster: newUrl,
        }
      }),
    )
    const updateOperations = updates.map((update) => ({
      updateOne: {
        filter: { _id: update._id },
        update: {
          $set: { poster: update.poster },
        },
      },
    }))
    console.log(updateOperations)

    await this.postModel.bulkWrite(updateOperations)
    console.log('post module poster urls updated')
  }

  @Cron('0 0 0 * * *')
  async updateContent() {
    const contents = await this.postModel.find().select('content').lean()
    const updates = await Promise.all(
      contents.map(async (obj) => {
        const reg = /(\!\[.*\])\((.*?\))/g
        const newContent = await updatePostContentImage(
          obj.content,
          reg,
          this.minioService.updateLink.bind(this.minioService),
        )
        return {
          ...obj,
          content: newContent,
        }
      }),
    )

    const updateOperations = updates.map((update) => ({
      updateOne: {
        filter: { _id: update._id },
        update: {
          $set: { content: update.content },
        },
      },
    }))

    await this.postModel.bulkWrite(updateOperations)
    console.log('post module content image urls updated')
  }
}
