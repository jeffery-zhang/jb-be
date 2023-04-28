import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Reply, ReplySchema } from './schemas/reply.schema'
import { RepliesService } from './replies.service'
import { RepliesController } from './replies.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reply.name, schema: ReplySchema }]),
  ],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule {}
