import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type PostDocument = Post & Document

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  poster: string

  @Prop({ required: true })
  intro: string

  @Prop({ required: true })
  author: string

  @Prop({ required: true })
  isPublic: boolean

  @Prop({ required: true })
  category: string

  @Prop({ required: true })
  tags: string[]

  @Prop({ required: true })
  content: string

  @Prop({ required: true, default: 0 })
  like: number

  @Prop({ required: true, default: 0 })
  pv: number

  @Prop({ required: true, default: new Date() })
  createTime: Date

  @Prop({ required: true, default: new Date() })
  updateTime: Date
}

export const PostSchema = SchemaFactory.createForClass(Post)
