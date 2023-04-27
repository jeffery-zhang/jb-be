import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Post } from './schemas/post.schema'
import { ISearchParams } from './interfaces/post.interface'
import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'
import { IReponseRecords } from '../shared/interfaces'
import { filterSearchParams } from '../shared/utils'

@Injectable()
export class PostsService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  async getPostsCount() {
    return await this.postModel.estimatedDocumentCount()
  }

  async search(params: ISearchParams): Promise<IReponseRecords<Post>> {
    const { conditions, pager, sorter } = filterSearchParams(params)
    // 根据搜索关键词进行匹配
    params.keywords &&
      (conditions['$or'] = [
        { title: { $regexp: new RegExp(params.keywords, 'i') } },
        { intro: { $regexp: new RegExp(params.keywords, 'i') } },
      ])

    // 执行查询操作
    const page = pager.page
    const pageSize = pager.pageSize
    const skipCount = (page - 1) * pageSize

    const query = this.postModel
      .find(conditions)
      .skip(skipCount)
      .limit(pageSize)
      .sort(sorter)

    const result = await query.exec()
    const total = await this.getPostsCount()

    return {
      page,
      pageSize,
      total,
      records: result,
    }
  }

  async findOneById(id: string) {
    return this.postModel.findById(id)
  }

  async create(author: string, createPostDto: CreatePostDto) {
    return await this.postModel.create({
      ...createPostDto,
      author,
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
