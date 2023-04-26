import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'
import { Types } from 'mongoose'

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException(`{id: ${id}} 不是有效的ObjectId值`)
    return id
  }
}
