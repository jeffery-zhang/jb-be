import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

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

  @Prop({ required: true })
  createTime: Date

  @Prop({ required: true, default: Date.now })
  updateTime: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
