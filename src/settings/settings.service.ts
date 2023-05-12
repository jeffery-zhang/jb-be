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

  async findOneByUserId(userId: string) {
    return await this.settingModel.findOne({ userId })
  }

  async create(dto: SettingDto) {
    return await this.settingModel.create(dto)
  }

  async update(dto: SettingDto): Promise<any> {
    const updateTime = new Date()
    return await this.settingModel.updateOne(
      { userId: dto.userId },
      {
        ...dto,
        updateTime,
      },
      {
        new: true,
      },
    )
  }
}
