import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type SettingDocument = Setting & Document

@Schema()
export class Setting {
  @Prop({ required: true })
  userId: string | 'default'

  @Prop()
  banner: string

  @Prop()
  theme: string

  @Prop()
  rounded: 0 | 1 | 2 | 3

  @Prop({ required: true, default: new Date() })
  createTime: Date

  @Prop({ required: true, default: new Date() })
  updateTime: Date
}

export const SettingSchema = SchemaFactory.createForClass(Setting)
