import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator'

export class UpdateTagDto {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(1)
  @IsOptional()
  name: string
}
