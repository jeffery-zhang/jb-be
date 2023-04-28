import { IsString, IsNotEmpty, Length } from 'class-validator'

export class CreateReplyDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  content: string

  @IsNotEmpty()
  @IsString()
  comment: string
}
