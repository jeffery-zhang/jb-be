import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ReplyDocument = Reply & Document

@Schema()
export class Reply extends Document {
  @Prop({ required: true })
  content: string

  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  comment: string

  @Prop({ required: true, default: 0 })
  like: number

  @Prop({ required: true, default: new Date() })
  createTime: Date

  @Prop({ required: true, default: new Date() })
  updateTime: Date
}

export const ReplySchema = SchemaFactory.createForClass(Reply)
