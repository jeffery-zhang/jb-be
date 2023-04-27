import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Comment, CommentSchema } from './schemas/comment.schema'
import { CommentsService } from './comments.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [],
  providers: [CommentsService],
})
export class CommentsModule {}
