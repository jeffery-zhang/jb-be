import { Injectable, ConflictException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Tag } from './schemas/tag.schema'
import { CreateTagDto } from './dtos/create-tag.dto'
import { UpdateTagDto } from './dtos/update-tag.dto'
import { filterSearchParams } from '../shared/utils'
import { ISearch, IReponseRecords } from '../shared/interfaces'

@Injectable()
export class TagsService {
  constructor(@InjectModel('Tag') private readonly tagModel: Model<Tag>) {}

  async getTagsCount() {
    return await this.tagModel.estimatedDocumentCount()
  }

  async search(params: ISearch): Promise<IReponseRecords<Tag>> {
    const { conditions, pager, sorter } = filterSearchParams(params)

    params.keywords &&
      (conditions['$or'] = [
        { name: { $regex: new RegExp(params.keywords, 'i') } },
      ])

    const query = this.tagModel
      .find(conditions)
      .skip(pager.skipCount)
      .limit(pager.pageSize)
      .sort(sorter)

    const result = await query.exec()
    const total = await this.getTagsCount()

    return {
      page: pager.page,
      pageSize: pager.pageSize,
      total,
      records: result,
    }
  }

  async findAll() {
    return this.tagModel.find().lean()
  }

  async findOneById(id: string) {
    return this.tagModel.findById(id).lean()
  }

  async findOneByName(name: string) {
    return this.tagModel.findOne({ name }).lean()
  }

  async create(createTagDto: CreateTagDto) {
    const tag = await this.findOneByName(createTagDto.name)
    if (tag) {
      throw new ConflictException('标签已存在')
    }
    return await this.tagModel.create(createTagDto)
  }

  async batchCreate(tags: string[]) {
    const uniquetags = [...new Set(tags)]
    const exists = await this.tagModel
      .find({ name: { $in: uniquetags } })
      .lean()
    const availableTags = uniquetags.filter(
      (name) => !exists.some((tag) => tag.name === name),
    )
    const newTags = await this.tagModel.insertMany(
      availableTags.map((name) => ({ name })),
    )
    return [...newTags, ...exists]
  }

  async update(updateTagDto: UpdateTagDto) {
    const tag = await this.findOneByName(updateTagDto.name)
    if (tag) {
      throw new ConflictException('标签名已存在')
    }
    const updateTime = new Date()
    return await this.tagModel.findByIdAndUpdate(updateTagDto.id, {
      ...updateTagDto,
      updateTime,
    })
  }

  async increasePostsNum(id: string) {
    const tag = await this.tagModel.findByIdAndUpdate(
      id,
      { $inc: { postsNum: 1 } },
      { new: true },
    )
    return tag.postsNum
  }

  async delete(id: string) {
    return await this.tagModel.findByIdAndDelete(id)
  }
}
