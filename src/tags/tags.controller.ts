import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
  Delete,
} from '@nestjs/common'

import { TagsService } from './tags.service'
import { CreateTagDto } from './dtos/create-tag.dto'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { UpdateTagDto } from './dtos/update-tag.dto'

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll() {
    return await this.tagsService.findAll()
  }

  @Post('save')
  async create(@Body() body: CreateTagDto) {
    await this.tagsService.create(body)
    return { message: '标签创建成功' }
  }

  @Post('batchCreate')
  async batchCreate(@Body() body: string[]) {
    await this.tagsService.batchCreate(body)
    return { message: '标签批量创建成功' }
  }

  @Put('save')
  async update(
    @Body('id', ObjectIdPipe) id: string,
    @Body() body: UpdateTagDto,
  ) {
    await this.tagsService.update(body)
    return { message: '标签更新成功' }
  }

  @Put('increase/:id')
  async increase(@Param('id', ObjectIdPipe) id: string) {
    await this.tagsService.increasePostsNum(id)
    return { message: '标签文章数量增加' }
  }

  @Get('search')
  async search(@Query('keyword') keyword: string) {
    return await this.tagsService.search(keyword)
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string) {
    return await this.tagsService.findOneById(id)
  }

  @Delete(':id')
  async delete(@Param('id', ObjectIdPipe) id: string) {
    await this.tagsService.delete(id)
    return { message: '标签删除成功' }
  }
}
