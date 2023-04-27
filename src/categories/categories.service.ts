import { Injectable, ConflictException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Category } from './schemas/category.schema'
import { CreateCateGoryDto } from './dtos/create-category.dto'
import { UpdateCateGoryDto } from './dtos/update-category.dto'
import { ISearch, IReponseRecords } from '../shared/interfaces'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<Category>,
  ) {}

  async getCategoriesCount() {
    return await this.categoryModel.estimatedDocumentCount()
  }

  async findAll() {
    return await this.categoryModel.find().lean()
  }

  async findOneById(id: string) {
    return await this.categoryModel.findById(id).lean()
  }

  async findOneByName(name: string) {
    return await this.categoryModel.findOne({ name }).lean()
  }

  async search(params: ISearch) {
    const conditions = {}
  }

  async create(createCateGoryDto: CreateCateGoryDto) {
    const category = await this.findOneByName(createCateGoryDto.name)
    if (category) {
      throw new ConflictException('分类已存在')
    }
    return await this.categoryModel.create(createCateGoryDto)
  }

  async update(updateCategoryDto: UpdateCateGoryDto) {
    const category = await this.findOneByName(updateCategoryDto.name)
    if (category) {
      throw new ConflictException('分类名已存在')
    }
    const updateTime = new Date()
    return await this.categoryModel.findByIdAndUpdate(
      updateCategoryDto.id,
      {
        ...updateCategoryDto,
        updateTime,
      },
      { new: true },
    )
  }

  async increasePostsNum(id: string) {
    return await this.categoryModel.findByIdAndUpdate(id, {
      $inc: { postsNum: 1 },
    })
  }

  async delete(id: string) {
    return await this.categoryModel.findByIdAndDelete(id)
  }
}
