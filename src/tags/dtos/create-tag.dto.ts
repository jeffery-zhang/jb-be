import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(1)
  name: string
}
