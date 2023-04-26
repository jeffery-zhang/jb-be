import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator'

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsString()
  @Length(1, 20)
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
