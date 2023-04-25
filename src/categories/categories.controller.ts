import { Controller, UseGuards, Get, Post, Body, Param } from '@nestjs/common'

import { CategoriesService } from './categories.service'
import { CreateCateGoryDto } from './dtos/create-category.dto'
import { UpdateCateGoryDto } from './dtos/update-category.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { Roles } from 'src/roles/role.decorator'
import { Role } from 'src/roles/role.enum'
import { RolesGuard } from 'src/roles/role.guard'

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
  async save(@Body() body: CreateCateGoryDto | UpdateCateGoryDto) {
    if ('id' in body) {
      await this.categoriesService.update(body)
      return { message: '分类更新成功' }
    }
    await this.categoriesService.create(body)
    return { message: '分类创建成功' }
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return await this.categoriesService.findOneById(id)
  }
}
