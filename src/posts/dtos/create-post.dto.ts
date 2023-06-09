import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator'

export class CreatePostDto {
  @IsString()
  @Length(1, 70)
  title: string

  @IsString()
  @Length(1, 255)
  intro: string

  @IsString()
  poster: string

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean

  @IsNotEmpty()
  @IsString()
  category: string

  @IsArray()
  @IsString({ each: true })
  tags: string[]

  @IsNotEmpty()
  @IsString()
  content: string
}
