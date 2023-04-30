import { Injectable, ConflictException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Category } from './schemas/category.schema'
import { CreateCateGoryDto } from './dtos/create-category.dto'
import { UpdateCateGoryDto } from './dtos/update-category.dto'
import { filterSearchParams } from '../shared/utils'
import { ISearch, IReponseRecords } from '../shared/interfaces'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<Category>,
  ) {}

  async getCategoriesCount() {
    return await this.categoryModel.estimatedDocumentCount()
  }

  async search(params: ISearch): Promise<IReponseRecords<Category>> {
    const { conditions, pager, sorter } = filterSearchParams(params)

    params.keywords &&
      (conditions['$or'] = [
        { name: { $regex: new RegExp(params.keywords, 'i') } },
        { alias: { $regex: new RegExp(params.keywords, 'i') } },
      ])

    const query = this.categoryModel
      .find(conditions)
      .skip(pager.skipCount)
      .limit(pager.pageSize)
      .sort(sorter)

    const result = await query.exec()
    const total = await this.getCategoriesCount()

    return {
      page: pager.page,
      pageSize: pager.pageSize,
      total,
      records: result,
    }
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

  async delete(id: string) {
    return await this.categoryModel.findByIdAndDelete(id)
  }
}
