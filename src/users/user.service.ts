import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User } from './schemas/user.schema'
import { RegisterDto } from '../auth/dtos/register.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async getUsersCount(): Promise<number> {
    return await this.userModel.estimatedDocumentCount()
  }

  async findAll() {
    return await this.userModel.find()
  }

  async findOneById(id: string): Promise<User> {
    return await this.userModel.findById(id)
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username })
  }

  async findOneByMail(mail: string): Promise<User> {
    return await this.userModel.findOne({ mail })
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const createTime = new Date().toLocaleString()
    const updateTime = new Date().toLocaleString()
    return await this.userModel.create({
      ...registerDto,
      createTime,
      updateTime,
    })
  }
}
