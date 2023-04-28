import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Comment } from './schemas/comment.schema'
import { CreateCommentDto } from './dtos/create-comment.dto'
import { UpdateCommentDto } from './dtos/update-comment.dto'
import { filterSearchParams } from '../shared/utils'
import { IReponseRecords } from '../shared/interfaces'
import { ISearchCommentParams } from './interfaces/search-comment.interface'

@Injectable()
export class CommentsService {
  constructor(@InjectModel('Comment') private commentModel: Model<Comment>) {}

  async getCommentsCount() {
    return await this.commentModel.estimatedDocumentCount()
  }

  async search(
    params: ISearchCommentParams,
  ): Promise<IReponseRecords<Comment>> {
    const { conditions, pager, sorter } = filterSearchParams(params)

    params.keywords &&
      (conditions['$or'] = [
        { content: { $regex: new RegExp(params.keywords, 'i') } },
      ])

    const query = this.commentModel
      .find(conditions)
      .skip(pager.skipCount)
      .limit(pager.pageSize)
      .sort(sorter)

    const result = await query.exec()
    const total = await this.getCommentsCount()

    return {
      page: pager.page,
      pageSize: pager.pageSize,
      total,
      records: result,
    }
  }

  async findAll() {
    return await this.commentModel.find().lean()
  }

  async findOneById(id: string) {
    return await this.commentModel.findById(id).lean()
  }

  async findOneByName(name: string) {
    return await this.commentModel.findOne({ name }).lean()
  }

  async create(
    userId: string,
    username: string,
    createCommentDto: CreateCommentDto,
  ) {
    return await this.commentModel.create({
      ...createCommentDto,
      userId,
      username,
    })
  }

  async update(updateCommentDto: UpdateCommentDto) {
    const updateTime = new Date()
    return await this.commentModel.findByIdAndUpdate(
      updateCommentDto.id,
      {
        ...updateCommentDto,
        updateTime,
      },
      { new: true },
    )
  }

  async like(id: string) {
    return await this.commentModel.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true },
    )
  }

  async reply(id: string) {
    return await this.commentModel.findByIdAndUpdate(
      id,
      { $inc: { replies: 1 } },
      { new: true },
    )
  }

  async delete(id: string) {
    return await this.commentModel.findByIdAndDelete(id)
  }
}
