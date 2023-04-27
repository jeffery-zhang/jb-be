import { IsString, IsNotEmpty, Length } from 'class-validator'

export class UpdateCommentDto {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  content: string
}
