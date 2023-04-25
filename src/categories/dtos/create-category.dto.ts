import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateCateGoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(1)
  name: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(1)
  alias: string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  sort: number
}
