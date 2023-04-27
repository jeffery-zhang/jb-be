import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common'

import { TagsService } from './tags.service'
import { CreateTagDto } from './dtos/create-tag.dto'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { UpdateTagDto } from './dtos/update-tag.dto'
import { ISearch } from '../shared/interfaces'
import { JwtAuthGuard } from 'src/auth/jwt.stradegy'
import { RolesGuard } from 'src/roles/role.guard'
import { Roles } from 'src/roles/role.decorator'
import { Role } from 'src/roles/role.enum'

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async search(@Query() query: ISearch) {
    return await this.tagsService.search(query)
  }

  @Get('all')
  async findAll() {
    return await this.tagsService.findAll()
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string) {
    return await this.tagsService.findOneById(id)
  }

  @Post('save')
  async create(@Body() body: CreateTagDto) {
    await this.tagsService.create(body)
    return { message: '标签创建成功' }
  }

  @Post('batchCreate')
  async batchCreate(@Body() body: string[]) {
    await this.tagsService.batchCreate(body)
    return { message: '批量创建标签成功' }
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
    return await this.tagsService.increasePostsNum(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ObjectIdPipe) id: string) {
    await this.tagsService.delete(id)
    return { message: '标签删除成功' }
  }
}
