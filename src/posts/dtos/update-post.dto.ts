import { IsNotEmpty, IsString } from 'class-validator'

import { CreatePostDto } from './create-post.dto'

export class UpdatePostDto extends CreatePostDto {
  @IsNotEmpty()
  @IsString()
  id: string
}
