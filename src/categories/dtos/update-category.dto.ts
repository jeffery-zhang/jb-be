import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator'

export class UpdateCateGoryDto {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(1)
  @IsOptional()
  name: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(1)
  @IsOptional()
  alias: string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  sort: number
}
