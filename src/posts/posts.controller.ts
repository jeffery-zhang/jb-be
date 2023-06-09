import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  Body,
  Param,
} from '@nestjs/common'

import { PostsService } from './posts.service'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { ISearchPostParams } from './interfaces/search-post.interface'
import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { UserChecker } from './guards/user-checker.guard'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async search(@Query() query: ISearchPostParams) {
    return await this.postsService.search(query)
  }

  @Get('ids')
  async getAllIds() {
    return await this.postsService.getAllIds()
  }

  @Get('realView/:id')
  async viewOneById(@Param('id', ObjectIdPipe) id: string) {
    this.postsService.increasePv(id)
    return await this.postsService.findOneById(id)
  }

  @Get('siblingsTwo/:id')
  async siblingsTwo(@Param('id', ObjectIdPipe) id: string) {
    return await this.postsService.siblingsTwo(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(@Request() req, @Body() createPostDto: CreatePostDto) {
    await this.postsService.create(
      req.user._id,
      req.user.username,
      createPostDto,
    )
    return { message: '新建文章成功' }
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Put('save')
  async update(
    @Body('id', ObjectIdPipe) id,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    await this.postsService.update(updatePostDto)
    return { message: '更新文章成功' }
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string) {
    return await this.postsService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Delete(':id')
  async delete(@Param('id', ObjectIdPipe) id: string) {
    await this.postsService.delete(id)
    return { message: '删除文章成功' }
  }
}
