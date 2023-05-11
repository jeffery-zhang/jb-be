import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Post, PostSchema } from './schemas/post.schema'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { CategoriesModule } from '../categories/categories.module'
import { MinioModule } from '../minio/minio.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    CategoriesModule,
    MinioModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
