import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Post } from './schemas/post.schema'
import { ISearchParams } from './interfaces/post.interface'
import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'

@Injectable()
export class PostsService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  async search(params: ISearchParams) {
    const conditions: any = {}
    // 根据搜索关键词进行匹配
    params.keywords &&
      (conditions['title'] = {
        $regex: new RegExp(params.keywords, 'i'),
      })

    // 根据作者进行匹配
    params.author && (conditions.author = params.author)

    // 根据分类进行匹配
    params.category && (conditions.category = params.category)

    // 根据标签进行匹配
    params.tag &&
      (conditions.tags = {
        $in: [params.tag],
      })

    // 根据排序方式进行排序
    let sort: any = {}
    switch (params.sortBy) {
      case 'createTime':
        sort = { createdAt: params.order || 'desc' }
        break
      case 'updateTime':
        sort = { updatedAt: params.order || 'desc' }
        break
      case 'like':
        sort = { likes: params.order || 'desc' }
        break
      case 'pv':
        sort = { pv: params.order || 'desc' }
        break
    }

    // 执行查询操作
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const skipCount = (page - 1) * pageSize

    const query = this.postModel
      .find(conditions)
      .skip(skipCount)
      .limit(pageSize)
      .sort(sort)

    const result = await query.exec()
    return result
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
