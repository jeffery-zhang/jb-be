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
} from '@nestjs/common'

import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dtos/create-comment.dto'
import { UpdateCommentDto } from './dtos/update-comment.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { Roles } from '../roles/role.decorator'
import { Role } from '../roles/role.enum'
import { RolesGuard } from '../roles/role.guard'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { ISearchCommentParams } from './interfaces/search-comment.interface'

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
  async create(@Body() body: CreateCommentDto) {
    await this.commentsService.create(body)
    return { message: '评论发布成功' }
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ObjectIdPipe) id: string) {
    await this.commentsService.delete(id)
    return { message: '评论删除成功' }
  }
}
