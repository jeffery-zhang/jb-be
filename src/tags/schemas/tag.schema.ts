import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type TagDocument = Tag & Document

@Schema()
export class Tag extends Document {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true, default: new Date() })
  createTime: Date

  @Prop({ required: true, default: new Date() })
  updateTime: Date
}

export const TagSchema = SchemaFactory.createForClass(Tag)
