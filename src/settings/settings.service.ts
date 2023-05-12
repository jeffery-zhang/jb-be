import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Setting } from './schemas/setting.schema'
import { ISearch } from '../shared/interfaces'
import { filterSearchParams } from '../shared/utils'
import { SettingDto } from './dtos/setting.dto'

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private readonly settingModel: Model<Setting>,
  ) {}

  async getSettingsCount() {
    return await this.settingModel.estimatedDocumentCount()
  }

  async findAll() {
    return await this.settingModel.find().lean()
  }

  async search(params: ISearch) {
    const { sorter, pager } = filterSearchParams(params)

    const query = this.settingModel
      .find()
      .skip(pager.skipCount)
      .limit(pager.pageSize)
      .sort(sorter)

    const result = await query.lean()
    const total = await this.getSettingsCount()

    return {
      page: pager.page,
      pageSize: pager.pageSize,
      total,
      records: result,
    }
  }

  async findDefault() {
    return await this.settingModel.findOne({ userId: 'default' })
  }

  async findOneByUserId(userId: string) {
    const setting = await this.settingModel.findOne({ userId })
    if (!setting) {
      return await this.findDefault()
    }
    return setting
  }

  async create(userId: string, dto: SettingDto) {
    return await this.settingModel.create({
      ...dto,
      userId,
    })
  }

  async update(userId: string, dto: SettingDto): Promise<any> {
    const updateTime = new Date()
    return await this.settingModel.updateOne(
      { userId },
      {
        ...dto,
        updateTime,
      },
      {
        new: true,
      },
    )
  }

  async putOne(dto: SettingDto, userId: string) {
    const exists = await this.settingModel.findOne({ userId })
    if (exists) {
      return await this.update(userId, dto)
    }
    return await this.create(userId, dto)
  }

  async delete(id: string): Promise<any> {
    return await this.settingModel.findByIdAndDelete(id)
  }
}
