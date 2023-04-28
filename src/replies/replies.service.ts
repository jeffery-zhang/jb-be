import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Reply } from './schemas/reply.schema'
import { CreateReplyDto } from './dtos/create-reply.dto'
import { UpdateReplyDto } from './dtos/update-reply.dto'
import { filterSearchParams } from '../shared/utils'
import { IReponseRecords } from '../shared/interfaces'
import { ISearchReplyParams } from './interfaces/search-reply.interface'

@Injectable()
export class RepliesService {
  constructor(@InjectModel('Reply') private replyModel: Model<Reply>) {}

  async getRepliesCount() {
    return await this.replyModel.estimatedDocumentCount()
  }

  async search(params: ISearchReplyParams): Promise<IReponseRecords<Reply>> {
    const { conditions, pager, sorter } = filterSearchParams(params)

    params.keywords &&
      (conditions['$or'] = [
        { content: { $regex: new RegExp(params.keywords, 'i') } },
      ])

    const query = this.replyModel
      .find(conditions)
      .skip(pager.skipCount)
      .limit(pager.pageSize)
      .sort(sorter)

    const result = await query.exec()
    const total = await this.getRepliesCount()

    return {
      page: pager.page,
      pageSize: pager.pageSize,
      total,
      records: result,
    }
  }

  async findAll() {
    return await this.replyModel.find().lean()
  }

  async findOneById(id: string) {
    return await this.replyModel.findById(id).lean()
  }

  async findOneByName(name: string) {
    return await this.replyModel.findOne({ name }).lean()
  }

  async create(
    userId: string,
    username: string,
    createReplyDto: CreateReplyDto,
  ) {
    UpdateReplyDto
    return await this.replyModel.create({
      ...createReplyDto,
      userId,
      username,
    })
  }

  async update(updateReplyDto: UpdateReplyDto) {
    const updateTime = new Date()
    return await this.replyModel.findByIdAndUpdate(
      updateReplyDto.id,
      {
        ...updateReplyDto,
        updateTime,
      },
      { new: true },
    )
  }

  async like(id: string) {
    return await this.replyModel.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true },
    )
  }

  async delete(id: string) {
    return await this.replyModel.findByIdAndDelete(id)
  }
}
