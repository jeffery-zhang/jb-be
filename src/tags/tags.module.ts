import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Tag, TagSchema } from './schemas/tag.schema'
import { TagsService } from './tags.service'
import { TagsController } from './tags.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
