import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  Body,
  UseGuards,
  Put,
  Param,
  Delete,
} from '@nestjs/common'

import { RepliesService } from './replies.service'
import { ISearchReplyParams } from './interfaces/search-reply.interface'
import { CreateReplyDto } from './dtos/create-reply.dto'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { UserChecker } from './guards/user-reply.guard'
import { UpdateReplyDto } from './dtos/update-reply.dto'

@Controller('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Get()
  async search(@Query() query: ISearchReplyParams) {
    return await this.repliesService.search(query)
  }

  @Get(':id')
  async findOneById(id: string) {
    return await this.repliesService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(@Request() req, @Body() body: CreateReplyDto) {
    const { _id, username } = req.user
    await this.repliesService.create(_id, username, body)
    return { message: '回复发布成功' }
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Put('save')
  async update(
    @Body('id', ObjectIdPipe) id: string,
    @Body() body: UpdateReplyDto,
  ) {
    await this.repliesService.update(body)
    return { message: '回复更新成功' }
  }

  @UseGuards(JwtAuthGuard)
  @Put('like')
  async like(@Body('id', ObjectIdPipe) id: string) {
    return await this.repliesService.like(id)
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Delete(':id')
  async delete(@Param('id', ObjectIdPipe) id: string) {
    await this.repliesService.delete(id)
    return { message: '回复删除成功' }
  }
}
