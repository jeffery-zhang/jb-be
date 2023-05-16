import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MinioModule } from '../minio/minio.module'
import { ScheduleService } from './schedule.service'
import { Banner, BannerSchema } from '../settings/schemas/banner.schema'
import { Post, PostSchema } from '../posts/schemas/post.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banner.name, schema: BannerSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    MinioModule,
  ],
  providers: [ScheduleService],
})
export class ScheduleModule {}
