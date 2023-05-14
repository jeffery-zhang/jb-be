import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Setting } from './schemas/setting.schema'
import { ISearch } from '../shared/interfaces'
import { filterSearchParams } from '../shared/utils'
import { SettingDto } from './dtos/setting.dto'
import { Banner } from './schemas/banner.schema'

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private readonly settingModel: Model<Setting>,
    @InjectModel(Banner.name) private readonly bannerModel: Model<Banner>,
  ) {}

  private availabelThemes = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Autumn', value: 'autumn' },
    { label: 'Winter', value: 'winter' },
    { label: 'Garden', value: 'garden' },
    { label: 'Forest', value: 'forest' },
    { label: 'Lofi', value: 'lofi' },
    { label: 'Luxury', value: 'luxury' },
    { label: 'Synthwave', value: 'synthwave' },
  ]

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

  getAllThemes() {
    return this.availabelThemes
  }

  async getAllBanners() {
    return await this.bannerModel.find().lean()
  }

  async addBanner(bannerUrl: string, name: string) {
    return await this.bannerModel.create({ bannerUrl, name })
  }

  async deleteBanner(id: string) {
    return await this.bannerModel.findByIdAndDelete(id)
  }
}
