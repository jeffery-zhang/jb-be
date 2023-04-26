import { Injectable, ConflictException } from '@nestjs/common'
import { Model } from 'mongoose'

import { Tag } from './schemas/tag.schema'
import { CreateTagDto } from './dtos/create-tag.dto'
import { UpdateTagDto } from './dtos/update-tag.dto'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class TagsService {
  constructor(@InjectModel('Tag') private readonly tagModel: Model<Tag>) {}

  async getTagsCount() {
    return await this.tagModel.estimatedDocumentCount()
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

  async search(keyword: string) {
    const regex = new RegExp(keyword, 'i')
    const tags = await this.tagModel
      .find({
        $or: [{ name: { $regex: regex } }, { alias: { $regex: regex } }],
      })
      .lean()
    return tags
  }

  async create(createTagDto: CreateTagDto) {
    const tag = await this.findOneByName(createTagDto.name)
    if (tag) {
      throw new ConflictException('标签已存在')
    }
    const createTime = new Date()
    const updateTime = new Date()
    return await this.tagModel.create({
      ...createTagDto,
      createTime,
      updateTime,
    })
  }

  async batchCreate(tags: string[]) {
    const uniquetags = [...new Set(tags)]
    const exists = await this.tagModel
      .find({ name: { $in: uniquetags } })
      .lean()
    const availableTags = uniquetags.filter(
      (name) => !exists.some((tag) => tag.name === name),
    )
    const createTime = new Date()
    const updateTime = new Date()
    return await this.tagModel.insertMany(
      availableTags.map((name) => ({ name, createTime, updateTime })),
    )
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
    return await this.tagModel.findByIdAndUpdate(id, {
      $inc: { postsNum: 1 },
    })
  }

  async delete(id: string) {
    return await this.tagModel.findByIdAndDelete(id)
  }
}
