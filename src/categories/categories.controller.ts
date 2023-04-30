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
import { ISearch } from '../shared/interfaces'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async search(@Query() query: ISearch) {
    return this.categoriesService.search(query)
  }

  @Get('all')
  async findAll() {
    return await this.categoriesService.findAll()
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string) {
    return await this.categoriesService.findOneById(id)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ObjectIdPipe) id: string) {
    await this.categoriesService.delete(id)
    return { message: '分类删除成功' }
  }
}
