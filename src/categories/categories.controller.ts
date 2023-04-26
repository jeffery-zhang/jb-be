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

import { CategoriesService } from './categories.service'
import { CreateCateGoryDto } from './dtos/create-category.dto'
import { UpdateCateGoryDto } from './dtos/update-category.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { Roles } from '../roles/role.decorator'
import { Role } from '../roles/role.enum'
import { RolesGuard } from '../roles/role.guard'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    return await this.categoriesService.findAll()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('save')
  async create(@Body() body: CreateCateGoryDto) {
    await this.categoriesService.create(body)
    return { message: '分类创建成功' }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put('save')
  async update(
    @Body('id', ObjectIdPipe) id: string,
    @Body() body: UpdateCateGoryDto,
  ) {
    await this.categoriesService.update(body)
    return { message: '分类更新成功' }
  }

  @Put('increase/:id')
  async increase(@Param('id', ObjectIdPipe) id: string) {
    await this.categoriesService.increasePostsNum(id)
    return { message: '分类文章数量增加' }
  }

  @Get('search')
  async search(@Query('keyword') keyword: string) {
    return await this.categoriesService.search(keyword)
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string) {
    return await this.categoriesService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ObjectIdPipe) id: string) {
    await this.categoriesService.delete(id)
    return { message: '分类删除成功' }
  }
}
