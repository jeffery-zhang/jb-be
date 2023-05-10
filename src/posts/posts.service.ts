import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Post } from './schemas/post.schema'
import { ISearchPostParams } from './interfaces/search-post.interface'
import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'
import { IReponseRecords } from '../shared/interfaces'
import { filterSearchParams } from '../shared/utils'
import { CategoriesService } from '../categories/categories.service'

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    private readonly categoriesService: CategoriesService,
  ) {}

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
}
