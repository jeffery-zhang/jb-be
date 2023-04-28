import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { PostsService } from '../posts.service'

@Injectable()
export class UserChecker implements CanActivate {
  constructor(private readonly postsService: PostsService) {}

  async canActivate(context: ExecutionContext) {
    const { user, params, body, method } = context.switchToHttp().getRequest()

    if (!user) throw new UnauthorizedException('用户未登录')

    const { _id, roles } = user

    let itemId = ''
    if (['GET', 'DELETE'].includes(method) && params.id) itemId = params.id
    if (['POST', 'PUT'].includes(method) && body.id) itemId = body.id
    if (!itemId) throw new BadRequestException('请求参数错误')

    const item = await this.postsService.findOneById(itemId)
    if (!item) throw new BadRequestException('请求参数错误')

    if (roles.includes('admin')) return true

    if (_id !== item.author) throw new UnauthorizedException('用户权限不足')

    return true
  }
}
