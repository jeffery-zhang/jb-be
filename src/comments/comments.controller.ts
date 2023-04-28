import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Query,
  Param,
  Put,
  Delete,
  Request,
} from '@nestjs/common'

import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dtos/create-comment.dto'
import { UpdateCommentDto } from './dtos/update-comment.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { ISearchCommentParams } from './interfaces/search-comment.interface'
import { UserChecker } from './guards/user-checker.guard'

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async search(@Query() query: ISearchCommentParams) {
    return this.commentsService.search(query)
  }

  @Get('all')
  async findAll() {
    return await this.commentsService.findAll()
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string) {
    return await this.commentsService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(@Request() req, @Body() body: CreateCommentDto) {
    const { _id, username } = req.user
    await this.commentsService.create(_id, username, body)
    return { message: '评论发布成功' }
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Put('save')
  async update(
    @Body('id', ObjectIdPipe) id: string,
    @Body() body: UpdateCommentDto,
  ) {
    await this.commentsService.update(body)
    return { message: '评论更新成功' }
  }

  @UseGuards(JwtAuthGuard)
  @Put('like')
  async like(@Body('id', ObjectIdPipe) id: string) {
    return await this.commentsService.like(id)
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Delete(':id')
  async delete(@Param('id', ObjectIdPipe) id: string) {
    await this.commentsService.delete(id)
    return { message: '评论删除成功' }
  }
}
