import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Role } from '../../roles/role.enum'

import { encryptPassword } from '../../shared/utils'

export type UserDocument = User & Document

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  mail: string

  @Prop()
  avatar: string

  @Prop()
  roles: Role[]

  @Prop({ required: true })
  createTime: Date

  @Prop({ required: true, default: Date.now })
  updateTime: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre<User>('save', async function (next) {
  this.password = await encryptPassword(this.password)
  next()
})
