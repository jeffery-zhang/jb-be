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
} from '@nestjs/common'

import { PostsService } from './posts.service'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { ISearchParams } from './interfaces/post.interface'
import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async search(@Query() query: ISearchParams) {
    return await this.postsService.search(query)
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(req.user._id, createPostDto)
  }

  @Put('save')
  async update(@Body() updatePostDto: UpdatePostDto) {
    return await this.postsService.update(updatePostDto)
  }

  @Get(':id')
  async findOneById(@Query('id', ObjectIdPipe) id: string) {
    return await this.postsService.findOneById(id)
  }

  @Delete(':id')
  async delete(@Query('id', ObjectIdPipe) id: string) {
    return await this.postsService.delete(id)
  }
}
