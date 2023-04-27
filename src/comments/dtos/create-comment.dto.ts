import { IsString, IsNotEmpty, Length } from 'class-validator'

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  content: string

  @IsNotEmpty()
  @IsString()
  userId: string

  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  post: string
}
