import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsString } from 'class-validator'
import { Document } from 'mongoose'

export type BannerDocument = Banner & Document

@Schema()
export class Banner {
  @Prop({ required: true })
  @IsString()
  name: string

  @Prop({ required: true })
  @IsString()
  bannerUrl: string

  @Prop({ required: true, default: new Date() })
  createTime: Date

  @Prop({ required: true, default: new Date() })
  updateTime: Date
}

export const BannerSchema = SchemaFactory.createForClass(Banner)
